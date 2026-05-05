import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { MissionBoardService } from '../../core/services/mission-board.service';
import type { MissionBoardEntryRow, MissionBoardRank } from '../../core/models/mission-board.model';

const RANK_OPTIONS: readonly MissionBoardRank[] = ['D', 'C', 'B', 'A', 'S', 'Special'];

const RANK_SORT_ORDER: Record<MissionBoardRank, number> = {
  D: 0,
  C: 1,
  B: 2,
  A: 3,
  S: 4,
  Special: 5
};

function sortMissions(rows: MissionBoardEntryRow[]): MissionBoardEntryRow[] {
  return [...rows].sort((a, b) => {
    const ra = RANK_SORT_ORDER[a.rank] ?? 99;
    const rb = RANK_SORT_ORDER[b.rank] ?? 99;
    if (ra !== rb) {
      return ra - rb;
    }
    return a.name.localeCompare(b.name);
  });
}

@Component({
  selector: 'app-mission-board',
  imports: [FormsModule, RouterLink],
  templateUrl: './mission-board.component.html',
  styleUrl: './mission-board.component.scss'
})
export class MissionBoardComponent {
  private readonly missionsApi = inject(MissionBoardService);
  readonly admin = inject(AdminService);

  readonly rankOptions = RANK_OPTIONS;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly missions = signal<MissionBoardEntryRow[]>([]);

  readonly sortedMissions = computed(() => sortMissions(this.missions()));

  readonly addRank = signal<MissionBoardRank>('D');
  readonly addName = signal('');
  readonly addDescription = signal('');
  readonly addNotes = signal('');
  readonly addRewardXp = signal('');
  readonly addRewardRyo = signal('');
  readonly addRewardDowntime = signal('');
  readonly formError = signal<string | null>(null);
  readonly saveBusy = signal(false);
  readonly deleteBusyId = signal<string | null>(null);
  readonly addDialog = viewChild<ElementRef<HTMLDialogElement>>('addDialog');

  constructor() {
    void this.reload();
  }

  async reload(options?: { quiet?: boolean }): Promise<void> {
    const quiet = options?.quiet ?? false;
    if (!quiet) {
      this.loading.set(true);
      this.error.set(null);
    }
    try {
      const rows = await this.missionsApi.listMissions();
      this.missions.set(rows);
      this.error.set(null);
    } catch (err) {
      if (quiet) {
        throw err;
      }
      this.error.set((err as Error).message);
    } finally {
      if (!quiet) {
        this.loading.set(false);
      }
    }
  }

  /** Reconcile with server after a successful mutation; failures do not undo the mutation. */
  private async refreshListAfterMutation(): Promise<void> {
    try {
      await this.reload({ quiet: true });
    } catch {
      await new Promise((r) => setTimeout(r, 700));
      try {
        await this.reload({ quiet: true });
      } catch {
        this.error.set(
          'The board could not be refreshed. Your change may still be saved — use Refresh to reload.'
        );
      }
    }
  }

  openAdd(): void {
    this.formError.set(null);
    this.addRank.set('D');
    this.addName.set('');
    this.addDescription.set('');
    this.addNotes.set('');
    this.addRewardXp.set('');
    this.addRewardRyo.set('');
    this.addRewardDowntime.set('');
    queueMicrotask(() => this.addDialog()?.nativeElement.showModal());
  }

  closeAdd(): void {
    this.addDialog()?.nativeElement.close();
  }

  scrollClass(rank: MissionBoardRank): string {
    switch (rank) {
      case 'D':
        return 'mb-scroll--d';
      case 'C':
        return 'mb-scroll--c';
      case 'B':
        return 'mb-scroll--b';
      case 'A':
        return 'mb-scroll--a';
      case 'S':
        return 'mb-scroll--s';
      case 'Special':
        return 'mb-scroll--special';
      default:
        return 'mb-scroll--d';
    }
  }

  async submitAdd(): Promise<void> {
    const name = this.addName().trim();
    if (!name) {
      this.formError.set('Name is required.');
      return;
    }
    this.formError.set(null);
    this.saveBusy.set(true);
    try {
      const row = await this.missionsApi.createMission({
        rank: this.addRank(),
        name,
        description: this.addDescription(),
        notes: this.addNotes(),
        reward_experience: this.addRewardXp(),
        reward_ryo: this.addRewardRyo(),
        reward_downtime: this.addRewardDowntime()
      });
      this.missions.update((rows) => {
        const rest = rows.filter((r) => r.id !== row.id);
        return [row, ...rest];
      });
      this.closeAdd();
      await this.refreshListAfterMutation();
    } catch (err) {
      this.formError.set((err as Error).message);
    } finally {
      this.saveBusy.set(false);
    }
  }

  async removeMission(id: string): Promise<void> {
    if (!this.admin.isAdmin() || !confirm('Remove this mission from the board?')) {
      return;
    }
    this.deleteBusyId.set(id);
    try {
      await this.missionsApi.deleteMission(id);
      this.missions.update((rows) => rows.filter((r) => r.id !== id));
      await this.refreshListAfterMutation();
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.deleteBusyId.set(null);
    }
  }
}
