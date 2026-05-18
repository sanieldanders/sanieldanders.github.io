import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [RouterLink],
  templateUrl: './clans.component.html',
  styleUrl: './clans.component.scss'
})
export class ClansComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

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
    return this.clans.find((c) => c.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.modalClan() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  openClan(clan: ClanEntry): void {
    this.selectedClanId.set(clan.id);
  }

  closeModal(): void {
    this.selectedClanId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalClan()) {
      this.closeModal();
    }
  }
}
