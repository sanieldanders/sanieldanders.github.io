import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SupabaseAuthService } from './core/services/supabase-auth.service';
import { DataStoreService } from './core/services/data-store.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly auth = inject(SupabaseAuthService);
  private readonly store = inject(DataStoreService);
  readonly window = window;
  readonly userEmail = computed(() => this.auth.user()?.email ?? null);
  readonly syncStatus = computed(() => this.store.syncStatus());
  readonly syncMessage = computed(() => this.store.syncMessage());

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      window.alert((error as Error).message);
    }
  }
}
