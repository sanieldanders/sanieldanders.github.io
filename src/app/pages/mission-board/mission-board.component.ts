import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { MissionBoardService } from '../../core/services/mission-board.service';
import { MISSION_BOARD_FIELD_LIMITS, type MissionBoardEntryRow, type MissionBoardRank } from '../../core/models/mission-board.model';

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
  private readonly destroyRef = inject(DestroyRef);
  readonly admin = inject(AdminService);
  private realtimeUnsubscribe: (() => void) | null = null;
  private realtimeRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  readonly rankOptions = RANK_OPTIONS;
  readonly fieldLimits = MISSION_BOARD_FIELD_LIMITS;

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
  readonly detailsBusyId = signal<string | null>(null);
  readonly deleteBusyId = signal<string | null>(null);
  readonly addDialog = viewChild<ElementRef<HTMLDialogElement>>('addDialog');

  constructor() {
    void this.reload();
    void this.initRealtimeSync();
    this.destroyRef.onDestroy(() => {
      this.realtimeUnsubscribe?.();
      this.realtimeUnsubscribe = null;
      if (this.realtimeRefreshTimer !== null) {
        clearTimeout(this.realtimeRefreshTimer);
        this.realtimeRefreshTimer = null;
      }
    });
  }

  private async initRealtimeSync(): Promise<void> {
    try {
      this.realtimeUnsubscribe = await this.missionsApi.subscribeToChanges(() => this.scheduleRealtimeRefresh());
    } catch {
      // Mission board still works with manual refresh if realtime is unavailable.
    }
  }

  private scheduleRealtimeRefresh(): void {
    if (this.realtimeRefreshTimer !== null) {
      clearTimeout(this.realtimeRefreshTimer);
    }
    this.realtimeRefreshTimer = setTimeout(() => {
      this.realtimeRefreshTimer = null;
      void this.reload({ quiet: true });
    }, 150);
  }

  async reload(options?: { quiet?: boolean }): Promise<void> {
    const quiet = options?.quiet ?? false;
    if (!quiet) {
      this.loading.set(true);
      this.error.set(null);
    }
    try {
      const rows = await this.missionsApi.listMissions();
      const loadedDetails = new Map(
        this.missions()
          .filter((mission) => mission.details_loaded)
          .map((mission) => [mission.id, mission] as const)
      );
      this.missions.set(
        rows.map((row) => {
          const loaded = loadedDetails.get(row.id);
          return loaded
            ? { ...row, description: loaded.description, notes: loaded.notes, details_loaded: true }
            : row;
        })
      );
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

  async loadMissionDetails(id: string): Promise<void> {
    if (this.detailsBusyId() === id) {
      return;
    }
    this.detailsBusyId.set(id);
    this.error.set(null);
    try {
      const details = await this.missionsApi.getMissionDetails(id);
      this.missions.update((rows) =>
        rows.map((row) =>
          row.id === id ? { ...row, ...details, details_loaded: true } : row
        )
      );
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.detailsBusyId.set(null);
    }
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
    const lengthError = this.validateFieldLengths();
    if (lengthError) {
      this.formError.set(lengthError);
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
      this.saveBusy.set(false);
      void this.refreshListAfterMutation();
    } catch (err) {
      this.formError.set((err as Error).message);
    } finally {
      this.saveBusy.set(false);
    }
  }

  private validateFieldLengths(): string | null {
    const checks: { label: string; value: string; max: number }[] = [
      { label: 'Name', value: this.addName().trim(), max: MISSION_BOARD_FIELD_LIMITS.name },
      { label: 'Description', value: this.addDescription().trim(), max: MISSION_BOARD_FIELD_LIMITS.description },
      { label: 'Notes', value: this.addNotes().trim(), max: MISSION_BOARD_FIELD_LIMITS.notes },
      { label: 'Experience reward', value: this.addRewardXp().trim(), max: MISSION_BOARD_FIELD_LIMITS.reward },
      { label: 'Ryo reward', value: this.addRewardRyo().trim(), max: MISSION_BOARD_FIELD_LIMITS.reward },
      { label: 'Downtime reward', value: this.addRewardDowntime().trim(), max: MISSION_BOARD_FIELD_LIMITS.reward }
    ];
    for (const { label, value, max } of checks) {
      if (value.length > max) {
        return `${label} must be ${max.toLocaleString()} characters or fewer (currently ${value.length.toLocaleString()}).`;
      }
    }
    return null;
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
