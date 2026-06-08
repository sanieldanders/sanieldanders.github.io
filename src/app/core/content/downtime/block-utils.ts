import type { DowntimeContentBlock } from './model';

export function h(text: string): DowntimeContentBlock {
  return { type: 'heading', text };
}

export function p(text: string): DowntimeContentBlock {
  return { type: 'paragraph', text };
}

export function t(
  caption: string,
  headers: readonly string[],
  rows: readonly (readonly string[])[]
): DowntimeContentBlock {
  return { type: 'table', caption, headers, rows };
}

export interface SealEntry {
  rank: string;
  name: string;
  cost: string;
  craftingDc?: string;
  text: string;
}

export function sealsToBlocks(seals: readonly SealEntry[]): DowntimeContentBlock[] {
  const blocks: DowntimeContentBlock[] = [];
  let lastRank = '';

  for (const seal of seals) {
    if (seal.rank !== lastRank) {
      lastRank = seal.rank;
      blocks.push(h(seal.rank));
    }
    blocks.push(h(seal.name));
    let body = `Ryo Cost: ${seal.cost}`;
    if (seal.craftingDc) {
      body += `\n\nCrafting DC: ${seal.craftingDc}`;
    }
    body += `\n\n${seal.text}`;
    blocks.push(p(body));
  }

  return blocks;
}
