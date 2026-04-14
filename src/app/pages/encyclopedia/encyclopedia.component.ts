import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NPC_ENCYCLOPEDIA_BUILTIN } from '../../core/content/npc-encyclopedia.builtin';
import type { NpcEncyclopediaEntry } from '../../core/models/app-data.model';

/** Assumes Western order "Given Family" (e.g. Naruto Uzumaki); sorts by family name, then given name. */
function compareNpcByLastName(a: NpcEncyclopediaEntry, b: NpcEncyclopediaEntry): number {
  const parts = (full: string) => full.trim().split(/\s+/).filter(Boolean);
  const familyName = (full: string) => {
    const p = parts(full);
    return p.length > 1 ? p[p.length - 1]! : p[0] ?? '';
  };
  const givenNames = (full: string) => {
    const p = parts(full);
    return p.length > 1 ? p.slice(0, -1).join(' ') : '';
  };
  const opts = { sensitivity: 'base' } as const;
  const byFamily = familyName(a.name).localeCompare(familyName(b.name), undefined, opts);
  if (byFamily !== 0) {
    return byFamily;
  }
  return givenNames(a.name).localeCompare(givenNames(b.name), undefined, opts);
}

@Component({
  selector: 'app-encyclopedia',
  imports: [RouterLink],
  templateUrl: './encyclopedia.component.html',
  styleUrl: './encyclopedia.component.scss'
})
export class EncyclopediaComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly entries = [...NPC_ENCYCLOPEDIA_BUILTIN].sort(compareNpcByLastName);

  readonly searchQuery = signal('');
  /** When set, modal is open; character resolved from current filter via `modalNpc`. */
  readonly selectedNpcId = signal<string | null>(null);

  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  readonly filteredEntries = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.entries;
    }
    return this.entries.filter((npc) => {
      const hay = [
        npc.name,
        npc.age,
        npc.birthday,
        npc.occupationRank,
        npc.affiliations,
        npc.description
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  });

  readonly modalNpc = computed(() => {
    const id = this.selectedNpcId();
    if (!id) {
      return null;
    }
    return this.filteredEntries().find((n) => n.id === id) ?? null;
  });

  /** Prev/next in the current filtered list (wraps). Null when only one or zero entries. */
  readonly modalNav = computed(() => {
    const list = this.filteredEntries();
    const id = this.selectedNpcId();
    if (!id || list.length <= 1) {
      return null;
    }
    const idx = list.findIndex((n) => n.id === id);
    if (idx < 0) {
      return null;
    }
    const len = list.length;
    return {
      prev: list[(idx - 1 + len) % len]!,
      next: list[(idx + 1) % len]!,
      position: idx + 1,
      total: len
    };
  });

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.modalNpc() ? 'hidden' : '';
    });
    effect(() => {
      const id = this.selectedNpcId();
      const npc = this.modalNpc();
      if (id && !npc) {
        this.selectedNpcId.set(null);
      }
    });
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  openNpc(npc: NpcEncyclopediaEntry): void {
    this.selectedNpcId.set(npc.id);
    setTimeout(() => this.closeBtn()?.nativeElement?.focus(), 0);
  }

  closeModal(): void {
    this.selectedNpcId.set(null);
  }

  goModalPrev(): void {
    const nav = this.modalNav();
    if (nav) {
      this.selectedNpcId.set(nav.prev.id);
    }
  }

  goModalNext(): void {
    const nav = this.modalNav();
    if (nav) {
      this.selectedNpcId.set(nav.next.id);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalNpc()) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.modalNpc()) {
      return;
    }
    const t = event.target as HTMLElement | null;
    if (t?.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goModalPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.goModalNext();
    }
  }
}
