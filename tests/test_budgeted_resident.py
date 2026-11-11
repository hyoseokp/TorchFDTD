"""Large resident admission must be byte- and index-bounded before allocation."""
from dataclasses import replace

import pytest
import torch

from torchfdtd import (AdjointOptions, AdjointExecutionPolicy, Region, Project,
    Monitor, Source, DifferentiableSimulation, DispersiveSimulation, estimate_adjoint_memory)
from torchfdtd.adjoint_memory import _cuda_index_contract
from torchfdtd.execution_tuning import _resident_reservation
from torchfdtd.models import server_limits
from test_streamed_dispersive import scene,inputs


def large_scene(size=25.6):
    return Project(region=Region(dimension='3d',size=(size,size,size),mesh=.1,
        steps=10,pml_cells=3,precision='float32',memory_mode='budgeted'),
        sources=[Source()],monitors=[Monitor()])


@pytest.mark.parametrize('device',['cpu','cuda'])
def test_large_metadata_requires_explicit_budget_without_allocating(monkeypatch,device):
    p=large_scene()
    assert p.region.shape==(256,256,256)
    monkeypatch.setattr('torchfdtd.adjoint_memory.host_memory',lambda:dict(available_bytes=128*1024**3))
    monkeypatch.setattr(torch.cuda,'mem_get_info',lambda device:(48*1024**3,48*1024**3))
    def forbidden(*a,**kw):pytest.fail('Created resident fields during metadata admission')
    monkeypatch.setattr('torchfdtd.differentiable._System',forbidden)
    with pytest.raises(ValueError,match='explicit resident byte budget'):
        estimate_adjoint_memory(p,device=device)
    options=AdjointOptions(checkpoints=0,resident_budget_bytes=16*1024**3)
    plan=estimate_adjoint_memory(p,options,device=device)
    assert plan['budgeted_resident']
    assert plan['memory_reservation_bytes']<=options.resident_budget_bytes
    with pytest.raises(ValueError,match='explicit resident byte budget'):
        estimate_adjoint_memory(p,replace(options,resident_budget_bytes=1),device=device)
    with pytest.raises(ValueError,match='explicit resident byte budget'):p.region.require_resident()


def test_default_workbench_guard_remains_and_budgeted_mode_roundtrips():
    p=large_scene()
    assert Project.model_validate(p.model_dump()).region.memory_mode=='budgeted'
    resident={**p.region.model_dump(),'memory_mode':'resident'}
    # The Python API admits the grid by memory; the workbench server keeps its cell limit, also for
    # the default execution_mode='auto' at the resident entry points.
    Region.model_validate({**resident,'execution_mode':'resident'}).require_resident()
    with server_limits():
        with pytest.raises(ValueError,match='server limits resident execution to 8,000,000 cells'):
            Region.model_validate({**resident,'execution_mode':'resident'})
        with pytest.raises(ValueError,match='server limits resident execution to 8,000,000 cells'):
            Region.model_validate(resident).require_resident()


def test_index_rejection_precedes_boundary_arrays_and_memory_query(monkeypatch):
    p=large_scene(100.)
    def forbidden(*a,**kw):pytest.fail('Allocated metadata or queried CUDA before rejecting overflowing field indices')
    monkeypatch.setattr('torchfdtd.adjoint_memory.BoundaryDescription',forbidden)
    monkeypatch.setattr(torch.cuda,'mem_get_info',forbidden)
    with pytest.raises(ValueError,match='field indexing'):
        estimate_adjoint_memory(p,AdjointOptions(resident_budget_bytes=1024**5),device='cuda')


def test_history_index_limit_can_be_avoided_with_bounded_spectral_seeds():
    p=scene(steps=100000)
    with pytest.raises(ValueError,match='observation indexing'):
        _cuda_index_contract(p.region,p.region.shape,50000,100000)
    _cuda_index_contract(p.region,p.region.shape,50000,32)


@pytest.mark.parametrize('dispersive',[False,True])
@pytest.mark.parametrize('device',['cpu','cuda'])
def test_budgeted_actual_execution_matches_legacy_and_preserves_gradients(device,dispersive):
    if device=='cuda' and not torch.cuda.is_available():pytest.skip('CUDA unavailable')
    p=scene(True,steps=12)
    values=tuple(v.to(device).requires_grad_() for v in inputs(p,'shared'))
    if not dispersive:values=values[:1]
    model_type=DispersiveSimulation if dispersive else DifferentiableSimulation
    options=AdjointOptions(checkpoints=2,backward_kernel='fused' if device=='cuda' else 'torch')
    legacy=model_type(p,options)(*values)
    gradients=torch.autograd.grad(legacy.signals.abs().square().sum(),values)
    p.region.memory_mode='budgeted'
    result=model_type(p,replace(options,resident_budget_bytes=64*1024**2))(*values)
    actual=torch.autograd.grad(result.signals.abs().square().sum(),values)
    torch.testing.assert_close(result.signals,legacy.signals,rtol=0,atol=0)
    for a,b in zip(actual,gradients):torch.testing.assert_close(a,b,rtol=0,atol=0)
    assert result.report['budgeted_resident']


def test_unified_large_resident_candidate_uses_byte_admission(monkeypatch):
    p=large_scene()
    p.region.memory_mode='streamed'
    monkeypatch.setattr('torchfdtd.adjoint_memory.host_memory',lambda:dict(available_bytes=128*1024**3))
    monkeypatch.setattr(torch.cuda,'mem_get_info',lambda device:(48*1024**3,48*1024**3))
    policy=AdjointExecutionPolicy(resident=AdjointOptions(checkpoints=0,resident_budget_bytes=16*1024**3),
        device='cuda',host_budget_bytes=4*1024**3)
    report=_resident_reservation(p,(p.region.shape,),policy)
    assert report['budgeted_resident'] and report['gpu_reservation_bytes']<16*1024**3
    assert p.region.memory_mode=='streamed'


@pytest.mark.parametrize('dispersive',[False,True])
def test_budget_denial_precedes_field_allocation_and_ade_packing(monkeypatch,dispersive):
    p=scene(True,steps=12)
    p.region.memory_mode='budgeted'
    values=inputs(p,'shared')
    model=(DispersiveSimulation if dispersive else DifferentiableSimulation)(
        p,AdjointOptions(resident_budget_bytes=1))
    def forbidden(*args,**kwargs):pytest.fail('Allocated fields or packed ADE before byte admission')
    monkeypatch.setattr('torchfdtd.differentiable._System',forbidden)
    monkeypatch.setattr('torchfdtd.dispersive_adjoint._DispersiveSystem',forbidden)
    monkeypatch.setattr(torch,'cat',forbidden)
    with pytest.raises(ValueError,match='explicit resident byte budget'):
        model(*values) if dispersive else model(values[0])


def test_unified_budget_also_bounds_input_and_gradient_copies(monkeypatch):
    p=scene(True)
    values=inputs(p,'shared')
    monkeypatch.setattr(torch.cuda,'mem_get_info',lambda device:(1024**3,2*1024**3))
    options=AdjointOptions(checkpoints=0,resident_budget_bytes=64*1024**2)
    native=estimate_adjoint_memory(p,options,device='cuda')
    # Enough for native fields, but not the wrapper's simultaneous parameter
    # and gradient copies. Deny before transferring the caller's CPU design.
    policy=AdjointExecutionPolicy(resident=replace(options,
        resident_budget_bytes=native['gpu_reservation_bytes']),device='cuda')
    model=policy.simulation(p)
    def forbidden(*args,**kwargs):pytest.fail('Copied before admitting transfer carriers')
    monkeypatch.setattr(torch.Tensor,'to',forbidden)
    with pytest.raises(ValueError,match='solver and transfers'):
        model(values[0])


@pytest.mark.parametrize('value',[True,0,-1,1.5])
def test_resident_budget_is_an_explicit_positive_integer(value):
    with pytest.raises(ValueError,match='resident_budget_bytes'):AdjointOptions(resident_budget_bytes=value)
