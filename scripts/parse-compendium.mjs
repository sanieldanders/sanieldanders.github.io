/**
 * Parses _compendium-raw.txt (from transcript) into public/jutsu-compendium.json
 * Run: node scripts/parse-compendium.mjs
 */
import fs from 'node:fs';

const root = new URL('..', import.meta.url);
const rawPath = new URL('_compendium-raw.txt', root);
const outPath = new URL('public/jutsu-compendium.json', root);

const TOP_MAJOR = new Set(['NINJUTSU', 'GENJUTSU', 'TAIJUTSU', 'BUKIJUTSU']);

const FALSE_TITLE = new Set([
  'STR DEX CON INT WIS CHA',
  'RANK',
  'LEVEL',
  'COST',
  'HP',
  'AC',
  'DR',
  'D10',
  'STATISTICS AND ADVANCEMENT',
  'SIZE MODIFIERS',
  'BUILDING A STAT BLOCK',
  'JUTSU SLOTS AND CASTING',
  'SUMMON DURATION',
  'SUMMON HIT POINT RECOVERY',
  'SUMMON ROLES',
  'SUMMONS SPECIAL SENSES',
  'COMMANDING A SUMMON',
  'DEATH AND INJURY',
  'SUMMON STAT BLOCKS',
  'SUMMONING JUTSU',
  'GENJUTSU BREAK',
  'WEASEL',
  'ANIMATED OBJECT STATISTICS',
  'EXCELLENT CHAKRA SPEARS',
  'REALITY BREAK EFFECTS',
  'SHINOBI BASICS',
  'BLADE',
  'FLAIL',
  'POLEARM',
  'POWER',
  'AMMUNITION',
  'CONFUSION EFFECTS'
]);

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function isRankLine(line) {
  const t = line.trim();
  return /^[AEDSBC]-RANK:?$/i.test(t) || /^S-RANK:?$/i.test(t);
}

function isNoiseLine(line) {
  const t = line.trim();
  if (!t) {
    return true;
  }
  if (/^\d{1,3}$/.test(t)) {
    return true;
  }
  if (t.length === 1) {
    return true;
  }
  if (t === '•' || t === 'o') {
    return true;
  }
  return false;
}

/** First line index of jutsu metadata (Classification, or Rank+Description for some Bukijutsu). */
function findMetadataLineIdx(lines, startIdx, max = 30) {
  const end = Math.min(lines.length, startIdx + max);
  for (let j = startIdx; j < end; j++) {
    const L = lines[j].trim();
    if (L.startsWith('Classification:')) {
      return j;
    }
    if (/^Rank:\s*[AEDSBC]-Rank/i.test(L)) {
      for (let k = j; k < Math.min(end, j + 18); k++) {
        if (lines[k].trim().startsWith('Description:')) {
          return j;
        }
      }
    }
    if (isRankLine(L)) {
      return -1;
    }
    if (TOP_MAJOR.has(L) || L === 'SUMMON STAT BLOCKS' || L === 'SUMMONING JUTSU') {
      return -1;
    }
  }
  return -1;
}

/** True if this line is a jutsu title: metadata begins within a few following lines. */
function hasMetadataSoon(lines, titleIdx, maxGap = 10) {
  const md = findMetadataLineIdx(lines, titleIdx + 1, 30);
  if (md < 0) {
    return false;
  }
  return md - titleIdx <= maxGap;
}

function isTitleShape(line) {
  const t = line.trim();
  if (t.length < 4 || t.length > 200) {
    return false;
  }
  if (!/[A-Z]{2,}/.test(t)) {
    return false;
  }
  if (/[a-z]/.test(t)) {
    return false;
  }
  if (!/^[A-Z0-9]/.test(t)) {
    return false;
  }
  if (!/^[A-Z0-9\s,'.\-/:()]+$/.test(t)) {
    return false;
  }
  if (FALSE_TITLE.has(t)) {
    return false;
  }
  if (TOP_MAJOR.has(t)) {
    return false;
  }
  if (isRankLine(t)) {
    return false;
  }
  return true;
}

function parseMetadata(body) {
  const oneLine = body.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  let classification =
    oneLine.match(/Classification:\s*([^R]+?)\s*Rank:/i)?.[1]?.trim() ??
    oneLine.match(/Classification:\s*([^K]+?)\s*Keywords:/i)?.[1]?.trim() ??
    oneLine.match(/Classification:\s*.+?(?=\s+Rank:)/i)?.[0]?.replace(/^Classification:\s*/i, '').trim();
  const rankM = oneLine.match(/Rank:\s*([AEDSBC]-Rank)/i);
  const rank = rankM ? rankM[1].replace(/rank/i, 'Rank').replace(/^./, (c) => c.toUpperCase()) : undefined;
  const keywordsM = oneLine.match(/Keywords:\s*([^D]+?)\s*Description:/i);
  const keywords = keywordsM
    ? keywordsM[1]
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [];
  if (!classification) {
    const hit = keywords.find((k) => /^(Ninjutsu|Genjutsu|Taijutsu|Bukijutsu)$/i.test(k));
    if (hit) {
      classification = hit;
    }
  }
  return { classification, rank, keywords };
}

function splitSummonStatBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let buf = [];
  const flush = () => {
    const b = buf.join('\n').trim();
    if (b.length > 40) {
      blocks.push(b);
    }
    buf = [];
  };
  const sizeRe = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\s+[\w/]+,/i;
  for (const line of lines) {
    if (sizeRe.test(line.trim()) && buf.length > 0) {
      flush();
    }
    buf.push(line);
  }
  flush();
  return blocks;
}

function main() {
  if (!fs.existsSync(rawPath)) {
    console.error('Missing', rawPath.pathname, '— run extract script first.');
    process.exit(1);
  }
  const raw = fs.readFileSync(rawPath, 'utf8');
  const preambleEnd = raw.indexOf('\nNINJUTSU\n');
  const body = preambleEnd >= 0 ? raw.slice(preambleEnd + 1) : raw;
  const lines = body.split(/\n/);

  const entries = [];
  const seenSlugs = new Map();

  const addEntry = (e) => {
    let s = slug(e.name);
    if (!s) {
      s = 'entry';
    }
    const n = (seenSlugs.get(s) ?? 0) + 1;
    seenSlugs.set(s, n);
    const id = n === 1 ? s : `${s}-${n}`;
    entries.push({
      id,
      ...e,
      searchText: [e.name, e.major ?? '', e.subsection ?? '', e.body, ...(e.keywords ?? [])]
        .join(' ')
        .toLowerCase()
    });
  };

  let major = 'NINJUTSU';
  let subsection = '';
  let i = 0;

  const summonIdx = lines.findIndex((l) => l.trim() === 'SUMMON STAT BLOCKS');
  const summoningJutsuIdx = lines.findIndex((l) => l.trim() === 'SUMMONING JUTSU');
  const genjutsuIdx = lines.findIndex((l) => l.trim() === 'GENJUTSU');

  if (summonIdx < 0 || summoningJutsuIdx < 0 || genjutsuIdx < 0) {
    console.error('Could not find major section markers.');
    process.exit(1);
  }

  /** @type {Array<[number, number]>} */
  const jutsuRanges = [
    [0, summonIdx],
    [genjutsuIdx, lines.length]
  ];

  for (const [from, to] of jutsuRanges) {
    major = from === 0 ? 'NINJUTSU' : 'GENJUTSU';
    i = from;
    while (i < to) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }
      if (TOP_MAJOR.has(line)) {
        major = line;
        subsection = '';
        i++;
        continue;
      }
      if (line === 'GENJUTSU BREAK') {
        subsection = 'Genjutsu Break';
        i++;
        continue;
      }
      if (isRankLine(line)) {
        i++;
        continue;
      }
      if (isNoiseLine(line)) {
        i++;
        continue;
      }

      if (isTitleShape(line) && !hasMetadataSoon(lines, i)) {
        subsection = line;
        i++;
        continue;
      }

      if (isTitleShape(line) && hasMetadataSoon(lines, i)) {
        const title = line.trim();
        const start = i;
        i++;
        while (i < to) {
          const L = lines[i].trim();
          if (TOP_MAJOR.has(L)) {
            break;
          }
          if (L === 'SUMMON STAT BLOCKS' || L === 'GENJUTSU') {
            break;
          }
          if (isNoiseLine(lines[i])) {
            i++;
            continue;
          }
          if (isTitleShape(L) && hasMetadataSoon(lines, i)) {
            break;
          }
          i++;
        }
        const blockLines = lines.slice(start, i).filter((l) => !isNoiseLine(l));
        const bodyText = blockLines.join('\n').trim();
        const meta = parseMetadata(bodyText);
        addEntry({
          kind: 'jutsu',
          name: title,
          major,
          subsection: subsection || undefined,
          classification: meta.classification,
          rank: meta.rank,
          keywords: meta.keywords,
          body: bodyText
        });
        continue;
      }
      i++;
    }
  }

  const statSection = lines.slice(summonIdx + 1, summoningJutsuIdx).join('\n');
  const statBlocks = splitSummonStatBlocks(statSection);
  for (const [idx, blk] of statBlocks.entries()) {
    const first = blk.split('\n')[0]?.trim() ?? `Summon ${idx + 1}`;
    addEntry({
      kind: 'summonStat',
      name: `Stat block: ${first}`,
      major: 'NINJUTSU',
      subsection: 'Summon stat blocks',
      body: blk,
      keywords: ['summon', 'stat block']
    });
  }

  const rulesSection = lines.slice(summoningJutsuIdx + 1, genjutsuIdx).join('\n').trim();
  if (rulesSection.length > 80) {
    addEntry({
      kind: 'rules',
      name: 'Summoning rules (Ninjutsu chapter)',
      major: 'NINJUTSU',
      subsection: 'Summoning reference',
      body: rulesSection,
      keywords: ['summon', 'blood pact', 'rules']
    });
  }

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: entries.length,
    entries
  };

  fs.mkdirSync(new URL('public/', root), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload), 'utf8');
  console.log('Wrote', entries.length, 'entries ->', outPath.pathname);
}

main();
