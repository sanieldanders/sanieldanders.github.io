"""Join broken multi-line p('...') string literals in downtime jutsu TS files."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / 'src' / 'app' / 'core' / 'content' / 'downtime'


def fix_file(path: Path) -> bool:
    lines = path.read_text(encoding='utf-8').splitlines()
    out: list[str] = []
    i = 0
    changed = False

    while i < len(lines):
        line = lines[i]
        stripped = line.lstrip()
        if stripped.startswith("p('") and not stripped.rstrip().endswith("'),"):
            parts = [line[line.index("p('") + 3 :]]
            i += 1
            while i < len(lines):
                next_line = lines[i]
                parts.append(next_line)
                if next_line.rstrip().endswith("'),"):
                    break
                i += 1
            joined = '\\n\\n'.join(p.rstrip().removesuffix("'),").strip() for p in parts)
            indent = line[: line.index('p(')]
            out.append(f"{indent}p('{joined}'),")
            changed = True
        else:
            out.append(line)
        i += 1

    if changed:
        path.write_text('\n'.join(out) + '\n', encoding='utf-8')
    return changed


def main() -> None:
    targets = sorted(DIR.glob('jutsu*.ts'))
    for path in targets:
        if fix_file(path):
            print(f'fixed {path.name}')


if __name__ == '__main__':
    main()
