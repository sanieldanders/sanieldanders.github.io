import { Injectable, computed, inject, signal } from '@angular/core';
import type { AppData } from '../models/app-data.model';
import { SupabaseAuthService } from './supabase-auth.service';

export type AdminUserDataRow = {
  user_id: string;
  data: AppData;
  updated_at: string;
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly auth = inject(SupabaseAuthService);
  private readonly isAdminState = signal(false);
  private readonly initializedState = signal(false);

  readonly isAdmin = computed(() => this.isAdminState());
  readonly isReady = computed(() => this.initializedState());

  async init(): Promise<void> {
    await this.auth.init();
    await this.refreshAdminState();
    this.auth.client.auth.onAuthStateChange(async () => {
      await this.refreshAdminState();
    });
    this.initializedState.set(true);
  }

  async refreshAdminState(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      this.isAdminState.set(false);
      return;
    }
    const { data, error } = await this.auth.client
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle<{ user_id: string }>();
    if (error) {
      this.isAdminState.set(false);
      return;
    }
    this.isAdminState.set(Boolean(data?.user_id));
  }

  async loadAllUserAppData(): Promise<AdminUserDataRow[]> {
    const { data, error } = await this.auth.client.rpc('admin_get_all_user_app_data');
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as AdminUserDataRow[];
  }

  /** Removes every row from `roll_events` (shared dice + chat). Requires admin_users membership. */
  async clearRollLog(): Promise<void> {
    const { error } = await this.auth.client.rpc('admin_clear_roll_events');
    if (error) {
      throw new Error(error.message);
    }
  }
}
