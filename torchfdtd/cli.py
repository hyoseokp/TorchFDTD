import argparse
import json
from pathlib import Path

from .models import Project, demo_project
from .solver import Simulation, hardware
from .stability_checks import stability_warnings


def main(argv=None):
    parser = argparse.ArgumentParser(prog='torchfdtd', description='GPU FDTD electromagnetic simulation for photonics.',
                                     epilog='AI agents: `torchfdtd mcp` serves MCP tools (pip install "torchfdtd[mcp]"); '
                                            'the agent guide is https://github.com/hyoseokp/TorchFDTD/blob/main/AGENTS.md')
    sub = parser.add_subparsers(dest='command', required=True)
    serve = sub.add_parser('serve', help='Open the local web workbench')
    serve.add_argument('--port', type=int, default=8765)
    # Loopback only. The workbench has no authentication, so a LAN or 0.0.0.0
    # bind is refused here rather than warned about; see docs/SECURITY.md. IPv6
    # loopback is not offered: the host check rejects a bracketed Host header.
    serve.add_argument('--host', default='127.0.0.1', choices=['127.0.0.1', 'localhost'],
                       help='loopback address to bind (default 127.0.0.1); remote exposure needs a separate authenticated deployment')
    # Off by default: the server applies its fixed size limits (models.SERVER_LIMITS) to every request.
    serve.add_argument('--memory-admission', action='store_true',
                       help='admit scenes by the memory estimate, as the Python API does, instead of the fixed server size limits; '
                            'for a single user on their own machine (docs/SECURITY.md)')
    run = sub.add_parser('run', help='Run a saved JSON project')
    run.add_argument('project')
    run.add_argument('--output', default='results/simulation.npz')
    batch = sub.add_parser('batch', help='Run a JSON case list concurrently without the UI')
    batch.add_argument('manifest', help='JSON list of {id, project: path or Project object, parameters: {}}')
    batch.add_argument('--output', required=True, help='Directory for per-case NPZ and resumable metadata')
    batch.add_argument('--backend', choices=['auto','cpu','cuda'], default='auto')
    batch.add_argument('--workers', type=int, default=2, help='Maximum simultaneous cases per device')
    batch.add_argument('--devices', type=int, nargs='+', help='CUDA device indices')
    batch.add_argument('--memory-fraction', type=float, default=.6)
    batch.add_argument('--memory-limit-mb', type=float)
    batch.add_argument('--resume', action='store_true')
    batch.add_argument('--fail-fast', action='store_true')
    example = sub.add_parser('example')
    example.add_argument('name', choices=['waveguide','scatterer','3d','pmc'])
    example.add_argument('--output', default='project.json')
    sub.add_parser('hardware')
    doctor = sub.add_parser('doctor', help='Report Python, torch, CuPy, CUDA runtime/driver, the device and the selected backend')
    doctor.add_argument('--json', action='store_true', help='Print the report as JSON')
    sub.add_parser('mcp', help='Serve TorchFDTD tools to AI agents over the Model Context Protocol (stdio); needs torchfdtd[mcp]')
    inspect = sub.add_parser('fsp-inspect', help='Inspect FSP using an installed, licensed Lumerical API')
    inspect.add_argument('project')
    inspect.add_argument('--output', default='inspection.json')
    inspect.add_argument('--archive', help='Optional .pwfsp bundle containing the unchanged original FSP')
    export = sub.add_parser('fsp-export', help='Copy FSP or apply verified object-property patches via Lumerical')
    export.add_argument('project')
    export.add_argument('--output', required=True)
    export.add_argument('--patches', help='JSON list of object_id/property/value patches; SI units')
    native_read = sub.add_parser('fsp-read-native', help='Independently decode recognized FSP layout records without Lumerical')
    native_read.add_argument('project')
    native_read.add_argument('--output',required=True)
    native_edit = sub.add_parser('fsp-edit-native', help='Apply supported fixed-width monitor edits without Lumerical')
    native_edit.add_argument('project')
    native_edit.add_argument('--output',required=True)
    native_edit.add_argument('--patches',required=True,help='JSON list of record_offset/property/value edits in binary property names')
    convert = sub.add_parser('fsp-convert', help='Convert supported FSP layout settings into an independent native JSON scene')
    convert.add_argument('project')
    convert.add_argument('--output', required=True)
    convert.add_argument('--report', required=True, help='Conversion diagnostics, coordinate origin and original SHA-256')
    convert.add_argument('--backend', choices=['auto', 'cpu', 'cuda'], default='auto')
    geometry = sub.add_parser('fsp-write-geometry', help='Write edited native primitive geometry into its original FSP without a vendor runtime')
    geometry.add_argument('original')
    geometry.add_argument('scene', help='Edited native JSON retaining its import fingerprint')
    geometry.add_argument('--output', required=True)
    geometry.add_argument('--report', required=True)
    scene_write = sub.add_parser('fsp-write-scene', help='Write supported existing objects, sources, monitors and region settings without a vendor runtime')
    scene_write.add_argument('original')
    scene_write.add_argument('scene', help='Edited native JSON retaining its original import fingerprint')
    scene_write.add_argument('--output', required=True)
    scene_write.add_argument('--report', required=True)
    args = parser.parse_args(argv)
    if args.command == 'serve':
        import uvicorn
        from .server import create_app
        uvicorn.run(create_app(memory_admission=args.memory_admission), host=args.host, port=args.port)
    elif args.command == 'run':
        project = Project.load(args.project)
        result = Simulation(project).run()
        result.summary['warnings'] = list(result.summary['warnings'])+stability_warnings(project)
        result.save(args.output)
        print(json.dumps(result.summary, indent=2))
    elif args.command == 'batch':
        from .batch import BatchCase, run_batch
        manifest = Path(args.manifest).resolve()
        entries = json.loads(manifest.read_text(encoding='utf-8'))
        cases = [BatchCase(entry['id'], Project.load(manifest.parent/entry['project']) if isinstance(entry['project'],str)
                           else Project.model_validate(entry['project']),entry.get('parameters',{})) for entry in entries]
        report = run_batch(cases,backend=args.backend,max_workers=args.workers,devices=args.devices,
                           memory_fraction=args.memory_fraction,memory_limit_mb=args.memory_limit_mb,
                           output_dir=args.output,resume=args.resume,fail_fast=args.fail_fast)
        print(json.dumps(report.as_dict(),indent=2))
        if not report.successful:parser.exit(1)
    elif args.command == 'example':
        demo_project(args.name).save(args.output)
        print(args.output)
    elif args.command == 'mcp':
        from .mcp_server import main as mcp_main
        mcp_main()
    elif args.command == 'doctor':
        from .doctor import main as doctor_main
        parser.exit(doctor_main(as_json=args.json))
    elif args.command == 'fsp-inspect':
        from .fsp import inspect_fsp, write_inspection, archive_fsp
        manifest = inspect_fsp(args.project)
        write_inspection(manifest, args.output)
        if args.archive:
            archive_fsp(args.project, args.archive, manifest)
        print(json.dumps({'objects': len(manifest['objects']), 'native_execution': False,
                          'inspection': args.output, 'archive': args.archive}, indent=2))
    elif args.command == 'fsp-export':
        from .fsp import export_fsp
        patches = json.loads(Path(args.patches).read_text(encoding='utf-8')) if args.patches else []
        print(json.dumps(export_fsp(args.project, args.output, patches), indent=2))
    elif args.command == 'fsp-convert':
        from .fsp_binary import FspDocument
        from .fsp_native import convert_fsp
        if Path(args.output).exists() or Path(args.report).exists():
            parser.error('Conversion output/report must be new paths.')
        if Path(args.output).resolve() == Path(args.report).resolve():
            parser.error('Scene output and conversion report need separate paths.')
        report = convert_fsp(FspDocument.load(args.project), Path(args.project).stem, args.backend)
        with Path(args.report).open('x', encoding='utf-8') as stream:
            json.dump(report.as_dict(), stream, indent=2, allow_nan=False)
        if report.project is None:
            parser.exit(2, f'FSP cannot be run natively yet. See {args.report} for object-specific diagnostics.\n')
        with Path(args.output).open('x', encoding='utf-8') as stream:
            stream.write(report.project.model_dump_json(indent=2))
        print(json.dumps({'output':args.output, 'report':args.report, 'requires_lumerical':False,
                          'native_execution':True, 'differences':len(report.issues)}, indent=2))
    elif args.command in ('fsp-write-geometry', 'fsp-write-scene'):
        from .fsp_binary import FspDocument
        from .fsp_geometry import write_fsp_geometry, write_fsp_scene
        if Path(args.output).exists() or Path(args.report).exists():
            parser.error('Geometry output/report must be new paths.')
        if Path(args.output).resolve() == Path(args.report).resolve():
            parser.error('Geometry output and report need separate paths.')
        writer = write_fsp_scene if args.command == 'fsp-write-scene' else write_fsp_geometry
        document, report = writer(FspDocument.load(args.original), Project.load(args.scene))
        document.save(args.output)
        with Path(args.report).open('x', encoding='utf-8') as stream:
            json.dump(report, stream, indent=2, allow_nan=False)
        print(json.dumps({'output':args.output, 'report':args.report, 'requires_lumerical':False,
                          'changed_fields':len(report['edits']), 'sha256':document.fingerprint()}, indent=2))
    elif args.command in ('fsp-read-native','fsp-edit-native'):
        from .fsp_binary import FspDocument
        document=FspDocument.load(args.project)
        if args.command=='fsp-read-native':
            with Path(args.output).open('x',encoding='utf-8') as stream:
                json.dump(document.inspect(),stream,indent=2,allow_nan=False)
        else:
            patches=json.loads(Path(args.patches).read_text(encoding='utf-8'))
            document=document.with_monitor_edits(patches)
            document.save(args.output)
        print(json.dumps({'output':args.output,'records':len(document.nodes()),'requires_lumerical':False,
                          'native_execution':False,'sha256':document.fingerprint()},indent=2))
    else:
        print(json.dumps(hardware(), indent=2))


if __name__ == '__main__':
    main()
