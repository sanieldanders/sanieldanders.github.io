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
import type { JutsuCompendiumEntry, JutsuCompendiumPayload } from '../../core/models/jutsu-compendium.model';

function compendiumJsonHref(doc: Document): string {
  const path = doc.location.pathname.replace(/\/$/, '') || '/';
  const segs = path.split('/').filter(Boolean);
  if (segs.length > 0) {
    segs.pop();
  }
  const basePath = segs.length ? `/${segs.join('/')}/` : '/';
  const u = new URL('jutsu-compendium.json', `${doc.location.origin}${basePath}`);
  return u.href;
}

function entryHaystack(e: JutsuCompendiumEntry): string {
  return [e.searchText, e.classification ?? '', e.rank ?? '', e.kind, e.keywords?.join(' ') ?? '']
    .join(' ')
    .toLowerCase();
}

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
    return list.filter((e) => {
      if (maj && (e.major ?? '') !== maj) {
        return false;
      }
      if (!q) {
        return true;
      }
      return entryHaystack(e).includes(q);
    });
  });

  readonly matchCount = computed(() => this.filteredEntries().length);

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
          this.entries.set(p.entries ?? []);
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
