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

@Component({
  selector: 'app-encyclopedia',
  imports: [RouterLink],
  templateUrl: './encyclopedia.component.html',
  styleUrl: './encyclopedia.component.scss'
})
export class EncyclopediaComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly entries = [...NPC_ENCYCLOPEDIA_BUILTIN].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  readonly searchQuery = signal('');
  readonly selectedNpc = signal<NpcEncyclopediaEntry | null>(null);

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

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.selectedNpc() ? 'hidden' : '';
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
    this.selectedNpc.set(npc);
    setTimeout(() => this.closeBtn()?.nativeElement?.focus(), 0);
  }

  closeModal(): void {
    this.selectedNpc.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedNpc()) {
      this.closeModal();
    }
  }
}
