import { Injectable, inject, signal } from '@angular/core';

import { SupabaseService } from '../supabaseService/supabase';
import { AuthService } from '../authService/auth';

import { Mensaje } from '../../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private supabase = inject(SupabaseService);

  private auth = inject(AuthService);

  mensajes = signal<Mensaje[]>([]);

  constructor() {

    this.cargarMensajes();

    this.escucharMensajes();

  }

  async cargarMensajes() {

    const { data, error } = await this.supabase
      .getClient()
      .from('mensajes')
      .select(`
        *,
        usuarios (
          nombre,
          apellido
        )
      `)
      .order('created_at', {
        ascending: true
      });

    if (!error && data) {

      this.mensajes.set(
        data as Mensaje[]
      );

    }

  }

  escucharMensajes() {

    this.supabase
      .getClient()
      .channel('chat-global')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes'
        },
        () => {

          this.cargarMensajes();

        }
      )
      .subscribe();

  }

  async enviarMensaje(texto: string) {

    const usuario = this.auth.usuario();

    if (!usuario) return;

    await this.supabase
      .getClient()
      .from('mensajes')
      .insert({
        usuario_id: usuario.id,
        contenido: texto
      });

  }

}