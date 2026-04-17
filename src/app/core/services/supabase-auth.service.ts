import { Injectable, computed, signal } from '@angular/core';
import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private readonly clientInstance: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
  );
  private readonly sessionState = signal<Session | null>(null);
  private initialized = false;

  readonly session = computed(() => this.sessionState());
  readonly user = computed<User | null>(() => this.sessionState()?.user ?? null);
  readonly isSignedIn = computed(() => Boolean(this.user()));

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    const { data } = await this.clientInstance.auth.getSession();
    this.sessionState.set(data.session ?? null);
    this.clientInstance.auth.onAuthStateChange((_event, session) => {
      this.sessionState.set(session);
    });
  }

  get client(): SupabaseClient {
    return this.clientInstance;
  }

  async signUp(email: string, password: string): Promise<void> {
    const { error } = await this.clientInstance.auth.signUp({ email, password });
    if (error) {
      throw new Error(this.readableError(error.message));
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.clientInstance.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(this.readableError(error.message));
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.clientInstance.auth.signOut();
    if (error) {
      throw new Error(this.readableError(error.message));
    }
  }

  private readableError(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('invalid login credentials')) {
      return 'Incorrect email or password.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Please confirm your email before signing in.';
    }
    if (msg.includes('already registered')) {
      return 'That email is already registered. Try signing in instead.';
    }
    if (msg.includes('password')) {
      return 'Password must be at least 6 characters.';
    }
    return message;
  }
}
