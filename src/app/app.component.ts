import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { SupabaseAuthService } from './core/services/supabase-auth.service';
import { DataStoreService } from './core/services/data-store.service';
import { AdminService } from './core/services/admin.service';
import { RollLogComponent } from './pages/roll-log/roll-log.component';
import { ThemeService, type AppTheme } from './core/services/theme.service';
import { DesignService, type AppDesign } from './core/services/design.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RollLogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly auth = inject(SupabaseAuthService);
  private readonly router = inject(Router);
  private readonly store = inject(DataStoreService);
  private readonly admin = inject(AdminService);
  private readonly themeService = inject(ThemeService);
  private readonly designService = inject(DesignService);
  readonly window = window;
  readonly theme = this.themeService.theme;
  readonly design = this.designService.design;
  readonly userEmail = computed(() => this.auth.user()?.email ?? null);
  readonly syncStatus = computed(() => this.store.syncStatus());
  readonly syncMessage = computed(() => this.store.syncMessage());
  readonly showAdmin = computed(() => this.admin.isAdmin());
  readonly rollSidebarOpen = signal(true);
  readonly settingsOpen = signal(false);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      startWith(null),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );
  readonly isLoginRoute = computed(() => this.currentUrl().startsWith('/login'));
  readonly showRollSidebar = computed(() => !this.isLoginRoute() && this.auth.isSignedIn() && this.rollSidebarOpen());

  constructor() {
    void this.admin.init();
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      await this.router.navigateByUrl('/login');
    } catch (error) {
      window.alert((error as Error).message);
    }
  }

  toggleRollSidebar(): void {
    this.rollSidebarOpen.update((v) => !v);
  }

  toggleSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.settingsOpen.update((open) => !open);
  }

  closeSettings(): void {
    this.settingsOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.settingsOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.settingsOpen.set(false);
  }

  setTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
  }

  setDesign(design: AppDesign): void {
    this.designService.setDesign(design);
  }
}
