import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabaseService/supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private router = inject(Router);
  private supabase = inject(SupabaseService);

  usuario = signal<any>(null);
  isAuthenticated = computed(() => this.usuario() !== null);
  userEmail = computed(() => this.usuario()?.email ?? 'Invitado');
  userName = computed(() => this.usuario()?.user_metadata?.['nombre'] ?? 'Invitado');

  constructor() {
    this.checkSession();

    this.supabase.getClient().auth.onAuthStateChange((_, session) => {
      this.usuario.set(session?.user ?? null);
    });
  }

  async checkSession() {
    const { data: { session } } = await this.supabase.getClient().auth.getSession();
    if (session?.user) {
      this.usuario.set(session.user);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });
    if (error) return false;
    if (data.user) {
      this.usuario.set(data.user);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  async registro(email: string, password: string, nombre: string, apellido: string, edad: number): Promise<boolean> {
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido, edad } }
    });
    if (error) return false;
    if (data.user) {
      this.usuario.set(data.user);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  async logout() {
    await this.supabase.getClient().auth.signOut();
    this.usuario.set(null);
    this.router.navigate(['/']);
  }
}