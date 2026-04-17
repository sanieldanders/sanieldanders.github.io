import { Injectable, computed, inject, signal } from '@angular/core';
import {
  createDefaultCharacterSheet,
  normalizeCharacter,
  type CharacterWithSheet
} from '../character/character-sheet.defaults';
import type { AppData, Character, JutsuDraft, Profile } from '../models/app-data.model';
import { SupabaseAuthService } from './supabase-auth.service';
import { CloudDataService } from './cloud-data.service';

const LOCAL_KEY = 'jutsu-companion-data';

function newId(): string {
  return crypto.randomUUID();
}

function emptyData(): AppData {
  return { profiles: [], characters: [] };
}

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  private readonly auth = inject(SupabaseAuthService);
  private readonly cloud = inject(CloudDataService);
  private readonly data = signal<AppData>(emptyData());
  private ready = signal(false);
  private hydrating = false;

  readonly profiles = computed(() => this.data().profiles);
  readonly characters = computed(() => this.data().characters);
  readonly isReady = computed(() => this.ready());

  async init(): Promise<void> {
    await this.auth.init();
    await this.reloadFromBestSource();
    this.auth.client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await this.reloadFromBestSource();
      }
    });
    this.ready.set(true);
  }

  private async reloadFromBestSource(): Promise<void> {
    let loaded: AppData = emptyData();
    const user = this.auth.user();
    if (user) {
      try {
        loaded = this.normalize((await this.cloud.loadForUser(user.id)) ?? emptyData());
        this.setDataWithoutPersist(loaded);
        return;
      } catch {
        loaded = emptyData();
      }
    }
    const bridge = window.jutsuElectron;
    if (bridge?.load) {
      try {
        const raw = await bridge.load();
        loaded = this.normalize(raw);
      } catch {
        loaded = emptyData();
      }
    } else {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        loaded = raw ? this.normalize(JSON.parse(raw)) : emptyData();
      } catch {
        loaded = emptyData();
      }
    }
    this.setDataWithoutPersist(loaded);
  }

  private setDataWithoutPersist(next: AppData): void {
    this.hydrating = true;
    this.data.set(next);
    this.hydrating = false;
  }

  private normalize(raw: unknown): AppData {
    if (!raw || typeof raw !== 'object') {
      return emptyData();
    }
    const o = raw as { profiles?: unknown; characters?: unknown };
    const p = o.profiles;
    if (!Array.isArray(p)) {
      return emptyData();
    }
    const c = o.characters;
    const characters = Array.isArray(c) ? c.filter((x): x is Character => this.isCharacter(x)) : [];
    return {
      profiles: p.filter((x): x is Profile => this.isProfile(x)),
      characters
    };
  }

  private isProfile(value: unknown): value is Profile {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const o = value as Profile;
    return typeof o.id === 'string' && typeof o.name === 'string' && Array.isArray(o.jutsus);
  }

  private isCharacter(value: unknown): value is Character {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const o = value as Character;
    if (typeof o.id !== 'string' || typeof o.name !== 'string' || typeof o.createdAt !== 'string') {
      return false;
    }
    if (o.jutsus !== undefined && !Array.isArray(o.jutsus)) {
      return false;
    }
    return true;
  }

  private persist(): void {
    if (this.hydrating) {
      return;
    }
    const snapshot = this.data();
    const user = this.auth.user();
    if (user) {
      void this.cloud.saveForUser(user.id, snapshot);
      return;
    }
    const bridge = window.jutsuElectron;
    if (bridge?.save) {
      void bridge.save(snapshot);
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
    }
  }

  private touch(): void {
    this.persist();
  }

  addProfile(name: string, notes?: string): Profile {
    const profile: Profile = {
      id: newId(),
      name: name.trim(),
      notes,
      jutsus: []
    };
    this.data.update((d) => ({ ...d, profiles: [...d.profiles, profile] }));
    this.touch();
    return profile;
  }

  updateProfile(profileId: string, patch: Partial<Pick<Profile, 'name' | 'notes'>>): void {
    this.data.update((d) => ({
      ...d,
      profiles: d.profiles.map((p) =>
        p.id === profileId ? { ...p, ...patch, name: patch.name?.trim() ?? p.name } : p
      )
    }));
    this.touch();
  }

  deleteProfile(profileId: string): void {
    this.data.update((d) => ({
      ...d,
      profiles: d.profiles.filter((p) => p.id !== profileId)
    }));
    this.touch();
  }

  getProfile(profileId: string): Profile | undefined {
    return this.data().profiles.find((p) => p.id === profileId);
  }

  getCharacter(characterId: string): CharacterWithSheet | undefined {
    const raw = this.data().characters.find((c) => c.id === characterId);
    if (!raw) {
      return undefined;
    }
    const withJutsus: Character = { ...raw, jutsus: raw.jutsus ?? [] };
    return normalizeCharacter(withJutsus);
  }

  addCharacter(name: string): CharacterWithSheet {
    const character: Character = {
      id: newId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      sheet: createDefaultCharacterSheet(),
      jutsus: []
    };
    this.data.update((d) => ({ ...d, characters: [...d.characters, character] }));
    this.touch();
    return normalizeCharacter(character);
  }

  updateCharacter(characterId: string, next: Character): void {
    this.data.update((d) => ({
      ...d,
      characters: d.characters.map((c) => (c.id === characterId ? { ...next, sheet: next.sheet } : c))
    }));
    this.touch();
  }

  deleteCharacter(characterId: string): void {
    this.data.update((d) => ({
      ...d,
      characters: d.characters.filter((c) => c.id !== characterId)
    }));
    this.touch();
  }

  upsertJutsu(profileId: string, draft: JutsuDraft): void {
    this.data.update((d) => ({
      ...d,
      profiles: d.profiles.map((p) => {
        if (p.id !== profileId) {
          return p;
        }
        const idx = p.jutsus.findIndex((j) => j.id === draft.id);
        const next = [...p.jutsus];
        if (idx >= 0) {
          next[idx] = draft;
        } else {
          next.push(draft);
        }
        return { ...p, jutsus: next };
      })
    }));
    this.touch();
  }

  deleteJutsu(profileId: string, jutsuId: string): void {
    this.data.update((d) => ({
      ...d,
      profiles: d.profiles.map((p) =>
        p.id === profileId ? { ...p, jutsus: p.jutsus.filter((j) => j.id !== jutsuId) } : p
      )
    }));
    this.touch();
  }

  newDraft(profileId: string, classification: JutsuDraft['classification']): JutsuDraft {
    const draft = buildNewDraft(classification);
    this.upsertJutsu(profileId, draft);
    return draft;
  }

  upsertJutsuForCharacter(characterId: string, draft: JutsuDraft): void {
    this.data.update((d) => ({
      ...d,
      characters: d.characters.map((c) => {
        if (c.id !== characterId) {
          return c;
        }
        const list = c.jutsus ?? [];
        const idx = list.findIndex((j) => j.id === draft.id);
        const next = [...list];
        if (idx >= 0) {
          next[idx] = draft;
        } else {
          next.push(draft);
        }
        return { ...c, jutsus: next };
      })
    }));
    this.touch();
  }

  deleteJutsuFromCharacter(characterId: string, jutsuId: string): void {
    this.data.update((d) => ({
      ...d,
      characters: d.characters.map((c) =>
        c.id === characterId ? { ...c, jutsus: (c.jutsus ?? []).filter((j) => j.id !== jutsuId) } : c
      )
    }));
    this.touch();
  }

  newDraftForCharacter(characterId: string, classification: JutsuDraft['classification']): JutsuDraft {
    const draft = buildNewDraft(classification);
    this.upsertJutsuForCharacter(characterId, draft);
    return draft;
  }
}

function buildNewDraft(classification: JutsuDraft['classification']): JutsuDraft {
  return {
    id: newId(),
    name: 'Untitled jutsu',
    classification,
    rank: 'D',
    archetypes: ['offensive'],
    prerequisites: {
      requiredFeature: 'none',
      components: defaultComponents(classification),
      range: 'touch',
      genjutsuTiers: {
        criticalSuccess: true,
        success: true,
        failure: true,
        criticalFailure: false
      }
    },
    effects: [],
    finalize: {},
    updatedAt: new Date().toISOString()
  };
}

function defaultComponents(classification: JutsuDraft['classification']): string[] {
  if (classification === 'ninjutsu') {
    return ['HS', 'CM'];
  }
  if (classification === 'genjutsu') {
    return ['HS', 'CM'];
  }
  if (classification === 'taijutsu') {
    return ['M'];
  }
  return ['M', 'W'];
}
