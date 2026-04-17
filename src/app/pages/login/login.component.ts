import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(SupabaseAuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'signin' | 'signup'>('signin');
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);

  email = '';
  password = '';

  async submit(): Promise<void> {
    this.message.set(null);
    if (!this.email.trim() || !this.password.trim()) {
      this.message.set('Please provide both email and password.');
      return;
    }
    this.busy.set(true);
    try {
      if (this.mode() === 'signup') {
        await this.auth.signUp(this.email.trim(), this.password);
        this.message.set('Account created. Check your email if confirmation is enabled.');
      } else {
        await this.auth.signIn(this.email.trim(), this.password);
        await this.router.navigateByUrl('/home');
      }
    } catch (error) {
      this.message.set((error as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  switchMode(next: 'signin' | 'signup'): void {
    this.mode.set(next);
    this.message.set(null);
  }
}
