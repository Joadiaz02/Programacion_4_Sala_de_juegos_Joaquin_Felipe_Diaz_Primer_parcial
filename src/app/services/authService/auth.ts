import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabaseService/supabase';
import { Usuario } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private router = inject(Router);
  private supabase = inject(SupabaseService);

  usuario = signal<Usuario | null>(null);
  isAuthenticated = computed(() => this.usuario() !== null);
  userEmail = computed(() => this.usuario()?.email ?? 'Invitado');
  userName = computed(() => this.usuario()?.nombre ?? 'Invitado');

  constructor() {
    this.checkSession();
  }

  async checkSession() {
    const { data: { session } } = await this.supabase.getClient().auth.getSession();
    if (session?.user) {
      this.usuario.set({
        id: session.user.id,
        email: session.user.email ?? '',
        nombre: session.user.user_metadata?.['nombre'] ?? '',
        apellido: session.user.user_metadata?.['apellido'] ?? '',
        edad: session.user.user_metadata?.['edad'] ?? 0
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });
    if (error) return false;
    if (data.user) {
      this.usuario.set({
        id: data.user.id,
        email: data.user.email ?? '',
        nombre: data.user.user_metadata?.['nombre'] ?? '',
        apellido: data.user.user_metadata?.['apellido'] ?? '',
        edad: data.user.user_metadata?.['edad'] ?? 0
      });
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
      await this.supabase.getClient().from('usuarios').insert([{
        id: data.user.id,
        email,
        nombre,
        apellido,
        edad
      }]);
      this.usuario.set({
        id: data.user.id,
        email,
        nombre,
        apellido,
        edad
      });
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