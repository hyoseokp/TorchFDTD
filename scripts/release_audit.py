"""Local source-archive manifest and dependency evidence. This is not legal clearance."""
import hashlib
from importlib.metadata import distribution, PackageNotFoundError
import json
from pathlib import Path
import re


def file_sha256(path):
    """SHA-256 of a file's exact bytes, shared with the completion-gate tools."""
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


# A skip whose reason names a missing CUDA device, CuPy or GPU is a GPU-required test that did not run.
# tests/conftest.py prefixes the reasons of ``optional``-marked tests so they are not counted.
GPU_SKIP_REASON = re.compile(r'cuda|cupy|gpu', re.IGNORECASE)
OPTIONAL_SKIP_PREFIX = 'optional platform check: '


def gpu_required_skips(skipped_reasons):
    """Test ids whose skip reason names CUDA, CuPy or a GPU and is not an optional platform check."""
    return sorted(test for test, reason in (skipped_reasons or {}).items()
                  if GPU_SKIP_REASON.search(reason or '') and not (reason or '').startswith(OPTIONAL_SKIP_PREFIX))


def main():
    folders=['.github','torchfdtd','frontend','examples','tests','scripts','benchmarks','docs']
    files=sorted(p for folder in folders for p in Path(folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    files += [Path(p) for p in ['README.md','LICENSE','THIRD_PARTY_NOTICES.txt','pyproject.toml','package.json','package-lock.json','vite.config.js','playwright.config.js','.gitignore','.gitattributes']]
    checks=[]
    patterns={
        'credential_token':re.compile(r'(?:gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)'),
        'literal_password':re.compile(r'''(?i)(?:password|passwd)\s*=\s*["'][^"']+["']'''),
        'workstation_address':re.compile(r'100\.123\.54\.121'),
    }
    binary_suffixes={'.png','.pdf','.zip','.whl','.pyc','.jpg','.ico'}
    for path in files:
        if path.suffix.lower() in ('.fsp','.ldf','.mdf','.pem','.key','.env'):
            checks.append(dict(file=path.as_posix(),kind='restricted_extension'))
        if path.suffix.lower() in binary_suffixes or path.name=='release_audit.py':continue
        try:text=path.read_text(encoding='utf-8')
        except UnicodeError:
            checks.append(dict(file=path.as_posix(),kind='invalid_utf8'));continue
        except OSError:
            checks.append(dict(file=path.as_posix(),kind='unreadable_file'));continue
        for kind,pattern in patterns.items():
            # Report file/line only, never print candidate credential contents.
            for match in pattern.finditer(text):checks.append(dict(file=path.as_posix(),kind=kind,line=text[:match.start()].count('\n')+1))
    dependencies=[]
    for name in ['fdtd','numpy','scipy','torch','fastapi','uvicorn','pydantic','cupy-cuda12x','psutil','gdstk']:
        try:d=distribution(name)
        except PackageNotFoundError:
            dependencies.append(dict(name=name,installed=False));continue
        license=d.metadata.get('License-Expression') or d.metadata.get('License') or ''
        classifiers=[c for c in d.metadata.get_all('Classifier',[]) if c.startswith('License ::')]
        dependencies.append(dict(name=name,version=d.version,license_label=license.splitlines()[0][:160] if license else None,
                                 license_classifiers=classifiers,
                                 licence_files=[str(p) for p in d.files or [] if 'license' in str(p).lower() and '.dist-info' in str(p)]))
    report=dict(status='PUBLIC_REPOSITORY_CONTRACT_GATE_OPEN',reason='The repository is public since 21 September 2026 by decision of the author. The interoperability contract question remains open.',
                scan_scope='Exact current source-archive allowlist. Pattern scan is not proof of absence of all secrets or intellectual-property issues.',
                dependency_scope='Direct Python dependencies are installed separately, not bundled in the source archive. Frontend notices retained. This is not a complete transitive SBOM.',
                dependencies=dependencies,findings=checks,
                files=[dict(path=p.as_posix(),bytes=p.stat().st_size,sha256=file_sha256(p)) for p in files])
    out=Path('results/release-review');out.mkdir(parents=True,exist_ok=True)
    (out/'source-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(dict(status=report['status'],source_files=len(files),findings=checks),indent=2))


if __name__=='__main__':main()
