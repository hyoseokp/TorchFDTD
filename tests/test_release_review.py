"""The README does not describe the interoperability features that the package keeps."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / 'README.md'


def test_readme_does_not_describe_the_interoperability_features_the_package_keeps():
    readme = README.read_text(encoding='utf-8')
    assert not re.search(r'Lumerical|\bFSP\b|\.fsp\b', readme), 'the README describes the interoperability features'
    assert 'not affiliated with Ansys' in readme
    for module in ('fsp.py', 'fsp_binary.py', 'fsp_native.py'):
        assert (ROOT / 'torchfdtd' / module).is_file(), module
