export type CompendiumEntryKind = 'jutsu' | 'summonStat' | 'rules';

export interface JutsuCompendiumEntry {
  id: string;
  kind: CompendiumEntryKind;
  name: string;
  major?: string;
  subsection?: string;
  classification?: string;
  rank?: string;
  keywords?: string[];
  body: string;
  searchText: string;
}

export interface JutsuCompendiumPayload {
  version: number;
  generatedAt: string;
  count: number;
  entries: JutsuCompendiumEntry[];
}
