import { Injectable, signal } from '@angular/core';
import {
  signIn,
  signUp,
  signOut,
  getUser,
  onAuthStateChange,
  type SignInParams,
  type SignUpParams,
} from '@ice-breaker/data-access-supabase';
import type { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  loading = signal(true);

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const currentUser = await getUser();
    this.user.set(currentUser);
    this.loading.set(false);

    onAuthStateChange((user) => {
      this.user.set(user);
    });
  }

  async signIn(params: SignInParams) {
    const { data, error } = await signIn(params);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async signUp(params: SignUpParams) {
    const { data, error } = await signUp(params);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async signOut() {
    const { error } = await signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  isAuthenticated() {
    return this.user() !== null;
  }
}
