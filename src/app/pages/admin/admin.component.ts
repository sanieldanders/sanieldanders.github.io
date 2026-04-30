import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ABILITY_LAYOUT } from '../../core/character/ability-layout';
import { ensureCharacterSheet, type CharacterWithSheet } from '../../core/character/character-sheet.defaults';
import type { Character } from '../../core/models/app-data.model';
import { AdminService, type AdminUserDataRow } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly admin = inject(AdminService);
  readonly abilityLayout = ABILITY_LAYOUT;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly rows = signal<AdminUserDataRow[]>([]);
  readonly filter = signal('');

  readonly visibleRows = computed(() => {
    const q = this.filter().trim().toLowerCase();
    if (!q) {
      return this.rows();
    }
    return this.rows().filter((row) => {
      if (row.user_id.toLowerCase().includes(q)) {
        return true;
      }
      return row.data.characters.some((c) => c.name.toLowerCase().includes(q));
    });
  });

  readonly totalCharacters = computed(() =>
    this.rows().reduce((count, row) => count + row.data.characters.length, 0)
  );

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.admin.refreshAdminState();
      if (!this.admin.isAdmin()) {
        this.rows.set([]);
        this.error.set('This account is not an admin.');
        return;
      }
      const data = await this.admin.loadAllUserAppData();
      this.rows.set(data);
    } catch (error) {
      this.error.set((error as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  setFilter(value: string): void {
    this.filter.set(value);
  }

  displayCharacter(character: Character): CharacterWithSheet {
    return ensureCharacterSheet(character);
  }
}
