import { Injectable, inject } from '@angular/core';
import { SupabaseAuthService } from './supabase-auth.service';
import type { AppData } from '../models/app-data.model';

type CloudRow = {
  data: AppData;
};

@Injectable({ providedIn: 'root' })
export class CloudDataService {
  private readonly auth = inject(SupabaseAuthService);

  async loadForUser(userId: string): Promise<AppData | null> {
    const { data, error } = await this.auth.client
      .from('user_app_data')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle<CloudRow>();

    if (error) {
      throw error;
    }
    return data?.data ?? null;
  }

  async saveForUser(userId: string, appData: AppData): Promise<void> {
    const { error } = await this.auth.client.from('user_app_data').upsert(
      {
        user_id: userId,
        data: appData
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      throw error;
    }
  }
}
