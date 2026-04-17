import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SupabaseAuthService } from './core/services/supabase-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly auth = inject(SupabaseAuthService);
  readonly window = window;
  readonly userEmail = computed(() => this.auth.user()?.email ?? null);

  async signUp(): Promise<void> {
    const email = window.prompt('Email for sign up');
    if (!email) {
      return;
    }
    const password = window.prompt('Password (min 6 chars)');
    if (!password) {
      return;
    }
    try {
      await this.auth.signUp(email, password);
      window.alert('Account created. Check your email if confirmation is enabled.');
    } catch (error) {
      window.alert((error as Error).message);
    }
  }

  async signIn(): Promise<void> {
    const email = window.prompt('Email');
    if (!email) {
      return;
    }
    const password = window.prompt('Password');
    if (!password) {
      return;
    }
    try {
      await this.auth.signIn(email, password);
    } catch (error) {
      window.alert((error as Error).message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      window.alert((error as Error).message);
    }
  }
}
