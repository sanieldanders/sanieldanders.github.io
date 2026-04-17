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
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.clientInstance.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.clientInstance.auth.signOut();
    if (error) {
      throw error;
    }
  }
}
