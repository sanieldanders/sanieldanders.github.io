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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { buildClanJutsuCompendiumEntries } from '../../core/content/clan-jutsu.compendium';
import type { JutsuCompendiumEntry, JutsuCompendiumPayload } from '../../core/models/jutsu-compendium.model';

function compendiumJsonHref(doc: Document): string {
  return new URL('jutsu-compendium.json', doc.baseURI).href;
}

function entryHaystack(e: JutsuCompendiumEntry): string {
  return [e.searchText, e.classification ?? '', e.rank ?? '', e.kind, e.keywords?.join(' ') ?? '']
    .join(' ')
    .toLowerCase();
}

const BASE_RELEASE_TYPES = ['Earth Release', 'Fire Release', 'Lightning Release', 'Water Release', 'Wind Release'];

@Component({
  selector: 'app-jutsu-compendium',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './jutsu-compendium.component.html',
  styleUrl: './jutsu-compendium.component.scss'
})
export class JutsuCompendiumComponent {
  private readonly http = inject(HttpClient);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly loadError = signal<string | null>(null);
  readonly entries = signal<JutsuCompendiumEntry[]>([]);
  readonly searchQuery = signal('');
  readonly majorFilter = signal<string>('');
  readonly kindFilter = signal<string>('');
  readonly classificationFilter = signal<string>('');
  readonly releaseFilter = signal<string>('');
  readonly keywordFilter = signal<string>('');
  readonly selectedId = signal<string | null>(null);

  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  readonly selectedEntry = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return null;
    }
    return this.entries().find((e) => e.id === id) ?? null;
  });

  readonly filteredEntries = computed(() => {
    const list = this.entries();
    const q = this.searchQuery().trim().toLowerCase();
    const maj = this.majorFilter();
    const kind = this.kindFilter();
    const classification = this.classificationFilter();
    const release = this.releaseFilter();
    const keyword = this.keywordFilter();
    return list.filter((e) => {
      if (maj && (e.major ?? '') !== maj) {
        return false;
      }
      if (kind && e.kind !== kind) {
        return false;
      }
      if (classification && (e.classification ?? '') !== classification) {
        return false;
      }
      if (release) {
        const releaseLower = release.toLowerCase();
        const hasReleaseKeyword = (e.keywords ?? []).some((k) => k.toLowerCase() === releaseLower);
        const hasReleaseText = entryHaystack(e).includes(releaseLower);
        if (!hasReleaseKeyword && !hasReleaseText) {
          return false;
        }
      }
      if (keyword && !(e.keywords ?? []).includes(keyword)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return entryHaystack(e).includes(q);
    });
  });

  readonly matchCount = computed(() => this.filteredEntries().length);
  readonly classifications = computed(() =>
    Array.from(new Set(this.entries().map((e) => e.classification).filter((v): v is string => Boolean(v)))).sort()
  );
  readonly releaseTypes = computed(() =>
    Array.from(
      new Set(
        [...BASE_RELEASE_TYPES, ...this.entries()
          .flatMap((e) => e.keywords ?? [])
          .filter((k) => /release/i.test(k))]
      )
    ).sort()
  );
  readonly keywords = computed(() =>
    Array.from(new Set(this.entries().flatMap((e) => e.keywords ?? [])))
      .filter((k) => !/release/i.test(k))
      .sort()
  );

  readonly modalNav = computed(() => {
    const cur = this.selectedEntry();
    const id = this.selectedId();
    const list = this.filteredEntries();
    if (!cur || !id || list.length <= 1) {
      return null;
    }
    const idx = list.findIndex((e) => e.id === id);
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
    const href = compendiumJsonHref(this.doc);
    this.http
      .get<JutsuCompendiumPayload>(href)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (p) => {
          const base = p.entries ?? [];
          const clanEntries = buildClanJutsuCompendiumEntries();
          this.entries.set([...base, ...clanEntries]);
          this.loadError.set(null);
        },
        error: () => {
          this.loadError.set(`Could not load compendium data (${href}).`);
        }
      });

    effect(() => {
      this.doc.body.style.overflow = this.selectedEntry() ? 'hidden' : '';
    });
    effect(() => {
      const id = this.selectedId();
      const e = this.selectedEntry();
      if (id && !e) {
        this.selectedId.set(null);
      }
    });
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onMajorChange(event: Event): void {
    this.majorFilter.set((event.target as HTMLSelectElement).value);
  }

  onKindChange(event: Event): void {
    this.kindFilter.set((event.target as HTMLSelectElement).value);
  }

  onClassificationChange(event: Event): void {
    this.classificationFilter.set((event.target as HTMLSelectElement).value);
  }

  onReleaseChange(event: Event): void {
    this.releaseFilter.set((event.target as HTMLSelectElement).value);
  }

  onKeywordChange(event: Event): void {
    this.keywordFilter.set((event.target as HTMLSelectElement).value);
  }

  openEntry(e: JutsuCompendiumEntry): void {
    this.selectedId.set(e.id);
    setTimeout(() => this.closeBtn()?.nativeElement?.focus(), 0);
  }

  closeModal(): void {
    this.selectedId.set(null);
  }

  goModalPrev(): void {
    const nav = this.modalNav();
    if (nav) {
      this.selectedId.set(nav.prev.id);
    }
  }

  goModalNext(): void {
    const nav = this.modalNav();
    if (nav) {
      this.selectedId.set(nav.next.id);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedEntry()) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.selectedEntry()) {
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
