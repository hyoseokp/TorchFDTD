"""Optional time-step unrolling with exact host observation barriers.

This changes host graph-launch frequency, not the Yee time step or sampling.
Every unrolled step executes the original update and advances its device counter.
Graphs have separate private pools because either graph can be replayed next.
"""
from __future__ import annotations

import torch


def validate_graph_steps(value, enabled=True):
    if isinstance(value, bool) or not isinstance(value, int) or not 1 <= value <= 64:
        raise ValueError('cuda_graph_steps must be an integer from 1 to 64.')
    if value != 1 and not enabled:
        raise ValueError('cuda_graph_steps > 1 requires CUDA graph execution.')
    return value


def observation_schedule(steps, width, barriers=()):
    """Yield (completed steps, replay width), stopping at every host barrier."""
    completed = 0
    for end in sorted(set(barriers) | {steps}):
        if not 0 < end <= steps:
            raise ValueError('Observation barriers must lie within the run.')
        while completed < end:
            advance = width if end-completed >= width else 1
            completed += advance
            yield completed, advance


class CudaStepGraphs:
    def __init__(self, step, states, steps, width=1):
        self.width = min(validate_graph_steps(width), steps)
        states = list(states)
        stream = torch.cuda.Stream()
        stream.wait_stream(torch.cuda.current_stream())
        with torch.cuda.stream(stream):
            for _ in range(min(3, steps)):
                step()
            for value in states:
                value.zero_()
        torch.cuda.current_stream().wait_stream(stream)
        torch.cuda.synchronize()
        self.graphs = {}
        for count in sorted({1, self.width}):
            # Capture on the side stream directly: torch.cuda.graph() would also run gc.collect() and
            # empty_cache() before every capture, which cost up to 0.1 s per solve on some hosts.
            graph = torch.cuda.CUDAGraph()
            with torch.cuda.stream(stream):
                graph.capture_begin()
                for _ in range(count):
                    step()
                graph.capture_end()
            self.graphs[count] = graph
            for value in states:
                value.zero_()
        torch.cuda.synchronize()

    def replay(self, width=1):
        self.graphs[width].replay()
