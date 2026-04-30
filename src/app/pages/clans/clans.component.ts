import { Component, computed, signal } from '@angular/core';
import { CLANS_BUILTIN } from '../../core/content/clans.builtin';
import type { ClanEntry } from '../../core/models/clan-entry.model';

function clanHaystack(clan: ClanEntry): string {
  return [
    clan.name,
    clan.tagline,
    clan.affiliations,
    clan.notes,
    clan.traits.join(' '),
    clan.features.join(' '),
    clan.signatureJutsu.join(' ')
  ]
    .join(' ')
    .toLowerCase();
}

@Component({
  selector: 'app-clans',
  imports: [],
  templateUrl: './clans.component.html',
  styleUrl: './clans.component.scss'
})
export class ClansComponent {
  readonly clans = [...CLANS_BUILTIN].sort((a, b) => a.name.localeCompare(b.name));
  readonly search = signal('');
  readonly selectedClanId = signal<string | null>(null);

  readonly filteredClans = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) {
      return this.clans;
    }
    return this.clans.filter((c) => clanHaystack(c).includes(q));
  });

  readonly modalClan = computed(() => {
    const id = this.selectedClanId();
    if (!id) {
      return null;
    }
    return this.filteredClans().find((c) => c.id === id) ?? null;
  });

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  openClan(clan: ClanEntry): void {
    this.selectedClanId.set(clan.id);
  }

  closeModal(): void {
    this.selectedClanId.set(null);
  }
}
