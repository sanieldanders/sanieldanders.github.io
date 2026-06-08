"""Generate jutsu downtime TypeScript content files from extracted source text."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT = ROOT / '_jutsu_extract.txt'
OUT_DIR = ROOT / 'src' / 'app' / 'core' / 'content' / 'downtime'

RANKS = ('E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank')

SKIP_HEADERS = {
    'COMPONENTS',
    'PREREQUISITES',
    'RANGES',
    'NINJUTSU TYPES',
    'GENJUTSU TYPES',
    'TAIJUTSU/BUKIJUTSU TYPES',
    'JUTSU EFFECT KEYWORDS',
    'COMPONENT KEYWORDS',
    'CORE KEYWORDS',
    'JUTSU RANGE',
}

TABLE_NOTES: dict[str, str] = {
    'core_keywords':
        'If Medical is added, or already a keyword, the user can choose to add either Poison, Acid or Necrotic Damage to the jutsu as if adding a new Nature Release damage type.',
}

TABLE_SPECS: dict[str, dict] = {
    'learning_downtime': {
        'caption': 'Learning downtime cost',
        'headers': ['Jutsu Rank', 'Self-Taught Downtime Cost', 'Master Taught Downtime Cost'],
        'rows': [
            ['E-Rank', '1', '1'],
            ['D-Rank', '3', '2'],
            ['C-Rank', '6', '4'],
            ['B-Rank', '12', '8'],
            ['A-Rank', '20', '16'],
            ['S-Rank', '40', '24'],
        ],
    },
    'effect_slots': {
        'caption': 'Jutsu rank effect slots',
        'headers': ['Jutsu Rank', 'Maximum Number of Effects'],
        'rows': [
            ['E-Rank', '1'],
            ['D-Rank', '4'],
            ['C-Rank', '5'],
            ['B-Rank', '6'],
            ['A-Rank', '7'],
            ['S-Rank', '8'],
        ],
    },
    'components': {
        'caption': 'Components',
        'headers': ['Component Keyword', 'Notes'],
        'rows': [
            ['Hand Seals (HS)', '(Mandatory for all created Ninjutsu / Genjutsu)'],
            ['Chakra Molding (CM)', '(Mandatory with Nature Release and Medical; mandatory for all Genjutsu)'],
            ['Chakra Seals (CS)', '(Mandatory with Fuinjutsu)'],
            ['Mobility (M)', '—'],
            ['Weapon (W)', '—'],
            ['Ninja Tools (NT)', '—'],
        ],
    },
    'prerequisites': {
        'caption': 'Prerequisites',
        'headers': ['Prerequisite Keywords', 'Bonus Effect Slots'],
        'rows': [
            ['Hijutsu', '+0'],
            ['Medical', '+0'],
            ['Fuinjutsu', '+0'],
            ['Nature Release', '+0'],
            ['Required Feature (Short Rest)', '+1'],
            ['Required Feature (Long Rest)', '+2'],
        ],
    },
    'ranges': {
        'caption': 'Ranges',
        'headers': ['Range Keywords', 'Notes'],
        'rows': [
            ['Self', '—'],
            ['Touch (5 feet)', '—'],
            ['Ranged', 'Up to 30 feet'],
        ],
    },
    'ninjutsu_damage': {
        'caption': 'Ninjutsu damage die pools by rank',
        'headers': ['Rank', 'Damage die pools'],
        'rows': [
            ['D-Rank', '6d4, 5d6, 4d8, 3d10, 2d12'],
            ['C-Rank', '10d4, 8d6, 6d8, 5d10, 4d12'],
            ['B-Rank', '12d6, 9d8, 7d10, 6d12'],
            ['A-Rank', '15d6, 11d8, 9d10, 7d12'],
            ['S-Rank', '20d6, 15d8, 12d10, 10d12'],
        ],
    },
    'ninjutsu_healing': {
        'caption': 'Ninjutsu healing die pools by rank',
        'headers': ['Rank', 'Healing die pools'],
        'rows': [
            ['D-Rank', '3d6, 2d8, 1d10'],
            ['C-Rank', '5d6, 4d8, 3d10, 2d12'],
            ['B-Rank', '6d6, 5d8, 4d10, 3d12'],
            ['A-Rank', '7d6, 6d8, 5d10, 4d12'],
            ['S-Rank', '10d6, 8d8, 7d10, 6d12'],
        ],
    },
    'ninjutsu_shielding': {
        'caption': 'Ninjutsu shielding die pools by rank',
        'headers': ['Rank', 'Shielding die pools'],
        'rows': [
            ['D-Rank', '3d4, 2d6, 1d8'],
            ['C-Rank', '5d4, 4d6, 3d8, 2d10'],
            ['B-Rank', '6d6, 5d8, 4d10, 3d12'],
            ['A-Rank', '7d6, 6d8, 5d10, 4d12'],
            ['S-Rank', '10d6, 8d8, 7d10, 6d12'],
        ],
    },
    'ninjutsu_dr': {
        'caption': 'Ninjutsu damage reduction die pools by rank',
        'headers': ['Rank', 'DR die pools'],
        'rows': [
            ['D-Rank', '2d4, 1d6'],
            ['C-Rank', '3d4, 2d6, 1d8'],
            ['B-Rank', '4d6, 3d8, 2d10'],
            ['A-Rank', '5d6, 4d8, 3d10'],
            ['S-Rank', '6d8, 5d10, 4d12'],
        ],
    },
    'finalize': {
        'caption': 'Final jutsu rank and downtime cost',
        'headers': ['Associated Rank', 'Chakra Cost', 'Downtime Cost (Solo)', 'Downtime Cost (Master)'],
        'rows': [
            ['E-Rank', 'Special (2 Chakra)', '1', '—'],
            ['D-Rank', 'Special (4 Chakra)', '3', '2'],
            ['C-Rank', 'Special (7 Chakra)', '5', '4'],
            ['B-Rank', 'Special (12 Chakra)', '10', '8'],
            ['A-Rank', 'Special (17 Chakra)', '15', '12'],
            ['S-Rank', 'Special (25 Chakra)', '25', '20'],
        ],
    },
    'genjutsu_damage': {
        'caption': 'Genjutsu damage die pools by rank',
        'headers': ['Rank', 'Damage die pools'],
        'rows': [
            ['D-Rank', '5d4, 4d6, 3d8, 2d10'],
            ['C-Rank', '8d4, 5d6, 4d8, 3d10, 2d12'],
            ['B-Rank', '12d4, 8d6, 6d8, 4d10, 3d12'],
            ['A-Rank', '16d4, 12d6, 9d8, 7d10, 5d12'],
            ['S-Rank', '20d4, 15d6, 12d8, 9d10, 7d12'],
        ],
    },
    'tai_damage': {
        'caption': 'Taijutsu/Bukijutsu damage die pools by rank',
        'headers': ['Rank', 'Damage die pools'],
        'rows': [
            ['D-Rank', '6d4, 4d6, 3d8, 2d10'],
            ['C-Rank', '8d4, 5d6, 4d8, 3d10, 2d12'],
            ['B-Rank', '7d6, 5d8, 5d10, 4d12'],
            ['A-Rank', '10d6, 8d8, 8d10, 6d12'],
            ['S-Rank', '12d8, 10d10, 8d12'],
        ],
    },
    'component_keywords': {
        'caption': 'Component keywords',
        'headers': ['Component Keyword', 'Removing Chakra Cost', 'Adding Chakra Cost', 'Downtime Cost'],
        'rows': [
            ['Hand Seals (HS)', '+1', '-1', '1-Week'],
            ['Chakra Seals (CS)', '+1', '-1', '2-Week(s)'],
            ['Weapon (W)', '+1', '-1', '1-Week'],
            ['Ninja Tools (NT)', '+1', '-1', '1-Week'],
        ],
    },
    'core_keywords': {
        'caption': 'Core keywords',
        'headers': ['Core Keywords', 'Removing Chakra Cost', 'Adding Chakra Cost', 'Downtime Cost'],
        'rows': [
            ['Medical', '-1', '+1', '1-Week'],
            ['Fuinjutsu', '-1', '+1', '1-Week'],
            ['Earth Release', '-', '+2', '3-Week'],
            ['Wind Release', '-', '+2', '3-Week'],
            ['Fire Release', '-', '+2', '3-Week'],
            ['Water Release', '-', '+2', '3-Week'],
            ['Lightning Release', '-', '+2', '3-Week'],
            ['Visual', '-2', '+2', '2-Week'],
            ['Auditory', '-1', '+1', '2-Week'],
            ['Inhale', '-1', '+1', '2-Week'],
            ['Tactile', '-1', '+1', '2-Week'],
            ['Clash', '-1', '+1', '2-Week'],
            ['Finisher', '-1', '+1', '1-Week'],
        ],
    },
    'jutsu_range': {
        'caption': 'Jutsu range',
        'headers': ['Component Keyword', 'Decreasing Range Chakra Cost', 'Increasing Range Chakra Cost', 'Downtime Cost'],
        'rows': [['Jutsu Range', '-1', '+1', '1-Week Per Increment']],
    },
    'damage_rank': {
        'caption': 'Final jutsu damage and rank correlation',
        'headers': ['Damage', 'Cost', 'Associated Rank'],
        'rows': [
            ['1-20', '1-9', 'D-Rank'],
            ['21-34', '10-15', 'C-Rank'],
            ['35-49', '15-20', 'B-Rank'],
            ['50-69', '21-28', 'A-Rank'],
            ['70+', '29+', 'S-Rank'],
        ],
    },
    'sensory_keywords': {
        'caption': 'Sensory keywords',
        'headers': ['Keyword', 'Requirement(s)'],
        'rows': [
            ['Visual', '—'],
            ['Tactile', 'Mandatory, if it deals Damage'],
            ['Auditory', '—'],
            ['Inhaled', 'Ninja Tools (NT)'],
            ['Unaware', 'Costs 1 Effect Slot'],
        ],
    },
    'tiers_of_success': {
        'caption': 'Tiers of success',
        'headers': ['Tier', 'Requirement(s)', 'Bonus Effect Slots'],
        'rows': [
            ['Critical Success', 'Mandatory, if Requiring a Save', 'If no Critical Success, -1'],
            ['Success', 'Mandatory, if Requiring a Save', '—'],
            ['Failure', 'Mandatory, if Requiring a Save', '—'],
            ['Critical Failure', 'Optional', 'If no Critical Failure, +1'],
        ],
    },
}

SECTIONS = {
    'learning': (0, 44),
    'ninjutsu': (44, 344),
    'genjutsu': (344, 685),
    'taijutsu': (685, 955),
    'customize': (955, 1203),
}

GARBAGE_PREFIXES = (
    'Notes Hand Seals',
    'Notes Self -',
    'Bonus Effect Slots Hijutsu',
    'Downtime Cost Hand Seals',
    'Downtime Cost (Master) E-Rank',
    'Master Taught Downtime cost E-Rank',
    'Maximum Number of Effects E-Rank',
    'Core Keywords\nRemoving',
    'Core Keywords Removing',
    'Core Keywords\n\nDowntime Cost',
    'Core Keywords\nDowntime Cost',
    'Downtime Cost Jutsu Range',
    'Tier Requirement(s) Bonus Effect Slots',
    'Associated Rank E-Rank',
)

TABLE_TRIGGERS: dict[str, list[tuple[str, str]]] = {
    'learning': [
        ('JUTSU RANK EFFECT SLOTS', 'effect_slots'),
    ],
    'ninjutsu': [
        ('COMPONENTS', 'components'),
        ('PREREQUISITES', 'prerequisites'),
        ('RANGES', 'ranges'),
        ('D-Rank: 6d4', 'ninjutsu_damage'),
        ('D-Rank: 3d6, 2d8', 'ninjutsu_healing'),
        ('D-Rank: 3d4, 2d6', 'ninjutsu_shielding'),
        ('D-Rank: 2d4, 1d6', 'ninjutsu_dr'),
        ('FINAL NINJUTSU RANK AND DT COST', 'finalize'),
    ],
    'genjutsu': [
        ('COMPONENTS', 'components'),
        ('PREREQUISITES', 'prerequisites'),
        ('SENSORY KEYWORDS', 'sensory_keywords'),
        ('TIERS OF SUCCESS', 'tiers_of_success'),
        ('D-Rank: 5d4', 'genjutsu_damage'),
        ('FINAL GENJUTSU RANK AND DT COST.', 'finalize'),
    ],
    'taijutsu': [
        ('COMPONENTS', 'components'),
        ('PREREQUISITES', 'prerequisites'),
        ('D-Rank: 6d4, 4d6', 'tai_damage'),
        ('FINAL TAIJUTSU/BUKIJUTSU RANK AND DT COST.', 'finalize'),
    ],
    'customize': [
        ('COMPONENT KEYWORDS', 'component_keywords'),
        ('CORE KEYWORDS', 'core_keywords'),
        ('JUTSU RANGE', 'jutsu_range'),
        ('FINAL JUTSU DAMAGE & RANK CORRELATION', 'damage_rank'),
    ],
}


def load_lines() -> list[str]:
    text = EXTRACT.read_text(encoding='utf-8')
    lines = [ln.rstrip() for ln in text.splitlines()]
    return lines


def is_page_number(line: str) -> bool:
    return bool(re.fullmatch(r'\d{2,3}', line.strip()))


def is_heading(line: str) -> bool:
    s = line.strip()
    if not s or len(s) > 120:
        return False
    if s.startswith('STEP '):
        return True
    if s in SKIP_HEADERS or s in {'SENSORY KEYWORDS', 'TIERS OF SUCCESS', 'Keyword', 'Requirement(s)', 'Tier'}:
        return False
    if s.endswith(':'):
        return False
    if re.fullmatch(r'[a-z]\)', s):
        return False
    if s in {'OFFENSIVE', 'DEFENSIVE', 'CONTROL', 'SUPPORT', 'TAIJUTSU', 'BUKIJUTSU'}:
        return True
    if s.isupper() and re.search(r'[A-Z]', s) and not re.search(r'\d', s):
        if len(s.split()) <= 8:
            return True
    return False


def title_case_heading(s: str) -> str:
    if s.startswith('STEP '):
        return s
    if re.search(r'\([A-Z]{1,4}\)', s):
        parts = s.split('(')
        head = parts[0].strip()
        tail = '(' + '('.join(parts[1:])
        if head.isupper():
            head = head.title()
        tail = re.sub(r'\(([a-zA-Z]+)\)', lambda m: '(' + m.group(1).upper() + ')', tail)
        return f'{head} {tail}'.strip() if head else tail
    mapping = {
        'NINJUTSU CREATION RULES': 'Ninjutsu creation rules',
        'GENJUTSU CREATION RULES': 'Genjutsu creation rules',
        'TAIJUTSU/BUKIJUTSU CREATION RULES': 'Taijutsu/Bukijutsu creation rules',
        'JUTSU CREATION EXAMPLE(S)': 'Jutsu creation example(s)',
        'CUSTOMIZING A JUTSU': 'Customizing a jutsu',
        'CUSTOMIZING A JUTSU RULES': 'Customizing a jutsu rules',
        'LEARNING/ CREATING A JUTSU': 'Learning / creating a jutsu',
        'LEARNING A JUTSU': 'Learning a jutsu',
        'CREATING A JUTSU': 'Creating a jutsu',
        'JUTSU RANK EFFECT SLOTS': 'Jutsu rank effect slots',
    }
    if s in mapping:
        return mapping[s]
    if s.isupper():
        return s.title()
    return s


def escape_ts(s: str) -> str:
    return s.replace('\\', '\\\\').replace("'", "\\'")


def emit_table(key: str) -> str:
    spec = TABLE_SPECS[key]
    rows = ',\n      '.join(
        '[' + ', '.join(f"'{escape_ts(c)}'" for c in row) + ']' for row in spec['rows']
    )
    headers = ', '.join(f"'{escape_ts(h)}'" for h in spec['headers'])
    return (
        f"    t('{escape_ts(spec['caption'])}', [{headers}], [\n"
        f"      {rows}\n"
        f"    ])"
    )


def should_skip_line(line: str, section: str) -> bool:
    s = line.strip()
    if not s:
        return True
    if is_page_number(s):
        return True
    if s in SKIP_HEADERS:
        return True
    if s in {
        'Jutsu Rank',
        'Self-Taught Downtime Cost',
        'Master Taught Downtime cost',
        'Maximum Number of Effects',
        'Component Keyword',
        'Notes',
        'Prerequisite Keywords',
        'Bonus Effect Slots',
        'Range Keywords',
        'Associated Rank',
        'Chakra Cost',
        'Downtime Cost (Solo)',
        'Downtime Cost (Master)',
        'Damage',
        'Cost',
        'Removing Chakra Cost',
        'Adding Chakra Cost',
        'Decreasing Range Chakra Cost',
        'Increasing Range Chakra Cost',
        'Keyword',
        'Requirement(s)',
        'Tier',
    }:
        return True
    if re.fullmatch(r'[A-Z]-Rank.*\d', s):
        return True
    if re.match(r'^(D|C|B|A|S)-Rank:', s):
        return True
    for rank in RANKS:
        if s == rank or s.startswith(rank + ' '):
            if re.search(r'\d', s):
                return True
    return False


def is_garbage_paragraph(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return True
    for prefix in GARBAGE_PREFIXES:
        if stripped.startswith(prefix):
            return True
    if re.fullmatch(r'[A-Z]-Rank.*\d.*[A-Z]-Rank.*', stripped.replace('\n', ' ')):
        return True
    return False


def parse_learning_section(lines: list[str]) -> list[str]:
    start, end = SECTIONS['learning']
    chunk = lines[start:end]
    blocks: list[str] = []

    def add_para(parts: list[str]) -> None:
        text = '\n\n'.join(parts).strip()
        if text and not is_garbage_paragraph(text):
            blocks.append(f"    p('{escape_ts(text)}')")

    blocks.append(f"    h('{escape_ts('Learning / creating a jutsu')}')")
    blocks.append(
        f"    p('{escape_ts(chunk[1].strip())}')"
    )
    blocks.append(f"    h('{escape_ts('Learning a jutsu')}')")
    add_para([
        chunk[3].strip(),
        '• ' + chunk[5].strip(),
        '• ' + chunk[7].strip(),
        chunk[8].strip(),
    ])
    blocks.append(emit_table('learning_downtime'))
    blocks.append(f"    h('{escape_ts('Creating a jutsu')}')")
    add_para([chunk[10].strip(), chunk[11].strip()])
    blocks.append(f"    h('{escape_ts(chunk[12].strip())}')")
    add_para([
        chunk[13].strip(),
        'a) ' + chunk[15].strip(),
        'b) ' + chunk[17].strip(),
        'c) ' + chunk[19].strip(),
        chunk[20].strip(),
    ])
    blocks.append(emit_table('effect_slots'))
    return blocks


def parse_section(section: str, lines: list[str]) -> list[str]:
    if section == 'learning':
        return parse_learning_section(lines)
    start, end = SECTIONS[section]
    chunk = lines[start:end]
    triggers = TABLE_TRIGGERS.get(section, [])
    trigger_map = {t[0]: t[1] for t in triggers}
    emitted_tables: set[str] = set()

    blocks: list[str] = []
    para_parts: list[str] = []
    i = 0

    def flush_para() -> None:
        nonlocal para_parts
        if not para_parts:
            return
        text = '\n\n'.join(para_parts).strip()
        if text and not is_garbage_paragraph(text):
            blocks.append(f"    p('{escape_ts(text)}')")
        para_parts = []

    while i < len(chunk):
        raw = chunk[i]
        s = raw.strip()

        if not s:
            i += 1
            continue

        # table triggers
        table_key = None
        for marker, key in triggers:
            if s.startswith(marker) or s == marker:
                if key not in emitted_tables:
                    table_key = key
                    emitted_tables.add(key)
                break
        if table_key:
            flush_para()
            blocks.append(emit_table(table_key))
            note = TABLE_NOTES.get(table_key)
            if note:
                blocks.append(f"    p('{escape_ts(note)}')")
            i += 1
            while i < len(chunk):
                nxt = chunk[i].strip()
                if not nxt:
                    i += 1
                    continue
                if is_heading(nxt) or nxt == '•' or nxt.startswith('STEP '):
                    break
                if should_skip_line(nxt, section) or is_garbage_paragraph(nxt):
                    i += 1
                    continue
                if re.fullmatch(r'[A-Z]-Rank', nxt) or nxt.startswith('D-Rank') or nxt.startswith('E-Rank'):
                    i += 1
                    continue
                break
            continue

        if should_skip_line(s, section):
            i += 1
            continue

        if s == '•':
            i += 1
            bullet = chunk[i].strip() if i < len(chunk) else ''
            i += 1
            para_parts.append(f'• {bullet}')
            continue

        if is_heading(s):
            flush_para()
            blocks.append(f"    h('{escape_ts(title_case_heading(s))}')")
            i += 1
            continue

        if re.fullmatch(r'[a-z]\)', s):
            i += 1
            rest = chunk[i].strip() if i < len(chunk) else ''
            i += 1
            para_parts.append(f'{s} {rest}')
            continue

        # multi-line paragraph accumulation
        parts = [s]
        i += 1
        while i < len(chunk):
            nxt = chunk[i].strip()
            if not nxt or is_heading(nxt) or nxt == '•' or should_skip_line(nxt, section):
                break
            if any(nxt.startswith(m) for m in trigger_map):
                break
            if re.fullmatch(r'[a-z]\)', nxt):
                break
            parts.append(nxt)
            i += 1
        para_parts.append(' '.join(parts))

    flush_para()
    return blocks


def write_activity(filename: str, export_name: str, meta: dict, blocks: list[str]) -> None:
    body = ',\n'.join(blocks)
    content = f"""import type {{ DowntimeActivity }} from './model';
import {{ h, p, t }} from './block-utils';

export const {export_name}: DowntimeActivity = {{
  id: '{meta['id']}',
  tileLabel: '{meta['tileLabel']}',
  modalTitle: '{meta['modalTitle']}',
  blocks: [
{body}
  ]
}};
"""
    (OUT_DIR / filename).write_text(content, encoding='utf-8', newline='\n')


def main() -> None:
    lines = load_lines()

    write_activity(
        'jutsu-learning.ts',
        'JUTSU_LEARNING_ACTIVITY',
        {
            'id': 'jutsu-learning',
            'tileLabel': 'Learning & creating',
            'modalTitle': 'Learning & creating a jutsu',
        },
        parse_section('learning', lines),
    )

    write_activity(
        'jutsu-ninjutsu.ts',
        'JUTSU_NINJUTSU_ACTIVITY',
        {
            'id': 'jutsu-ninjutsu',
            'tileLabel': 'Ninjutsu creation',
            'modalTitle': 'Ninjutsu creation rules',
        },
        parse_section('ninjutsu', lines),
    )

    write_activity(
        'jutsu-genjutsu.ts',
        'JUTSU_GENJUTSU_ACTIVITY',
        {
            'id': 'jutsu-genjutsu',
            'tileLabel': 'Genjutsu creation',
            'modalTitle': 'Genjutsu creation rules',
        },
        parse_section('genjutsu', lines),
    )

    write_activity(
        'jutsu-taijutsu.ts',
        'JUTSU_TAIJUTSU_ACTIVITY',
        {
            'id': 'jutsu-taijutsu',
            'tileLabel': 'Taijutsu / Bukijutsu creation',
            'modalTitle': 'Taijutsu / Bukijutsu creation rules',
        },
        parse_section('taijutsu', lines),
    )

    write_activity(
        'jutsu-customize.ts',
        'JUTSU_CUSTOMIZE_ACTIVITY',
        {
            'id': 'jutsu-customize',
            'tileLabel': 'Customizing a jutsu',
            'modalTitle': 'Customizing a jutsu',
        },
        parse_section('customize', lines),
    )

    category = """import type { DowntimeCategory } from './model';
import { JUTSU_CUSTOMIZE_ACTIVITY } from './jutsu-customize';
import { JUTSU_GENJUTSU_ACTIVITY } from './jutsu-genjutsu';
import { JUTSU_LEARNING_ACTIVITY } from './jutsu-learning';
import { JUTSU_NINJUTSU_ACTIVITY } from './jutsu-ninjutsu';
import { JUTSU_TAIJUTSU_ACTIVITY } from './jutsu-taijutsu';

export const JUTSU_CATEGORY: DowntimeCategory = {
  id: 'jutsu',
  label: 'Jutsu',
  activities: [
    JUTSU_LEARNING_ACTIVITY,
    JUTSU_NINJUTSU_ACTIVITY,
    JUTSU_GENJUTSU_ACTIVITY,
    JUTSU_TAIJUTSU_ACTIVITY,
    JUTSU_CUSTOMIZE_ACTIVITY
  ]
};
"""
    (OUT_DIR / 'jutsu.ts').write_text(category, encoding='utf-8', newline='\n')
    print('Generated jutsu downtime files.')


if __name__ == '__main__':
    main()
