import { CLANS_BUILTIN } from './clans.builtin';
import type { JutsuCompendiumEntry } from '../models/jutsu-compendium.model';

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function rankFromName(name: string): string | undefined {
  const m = name.match(/\b([EDSBCA])-\s*Rank\b/i);
  return m ? `${m[1].toUpperCase()}-Rank` : undefined;
}

export function buildClanJutsuCompendiumEntries(): JutsuCompendiumEntry[] {
  const out: JutsuCompendiumEntry[] = [];
  for (const clan of CLANS_BUILTIN) {
    for (const jutsuName of clan.signatureJutsu) {
      if (!jutsuName || jutsuName.startsWith('(')) {
        continue;
      }
      const id = `clan-${clan.id}-${slug(jutsuName)}`;
      const rank = rankFromName(jutsuName);
      const body = [
        `${jutsuName} is listed in the ${clan.name} packet as a signature technique.`,
        `Clan: ${clan.name}`,
        `Tagline: ${clan.tagline}`,
        `Reference note: ${clan.notes}`
      ].join('\n');
      out.push({
        id,
        kind: 'jutsu',
        name: jutsuName,
        major: 'CLANS',
        subsection: clan.name,
        classification: undefined,
        rank,
        keywords: ['clan', clan.name.replace(/\s+Clan$/i, ''), ...(clan.traits ?? [])],
        body,
        searchText: `${jutsuName} ${clan.name} ${clan.tagline} ${clan.notes}`.toLowerCase()
      });
    }
  }
  return out;
}
