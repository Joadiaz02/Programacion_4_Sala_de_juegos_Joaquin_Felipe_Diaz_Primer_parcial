import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../supabaseService/supabase';
import { AuthService } from '../authService/auth';

@Injectable({
  providedIn: 'root'
})
export class AhorcadoService {

  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  palabra = signal<string>('');
  descripcion = signal<string>('');
  letrasUsadas = signal<string[]>([]);
  errores = signal<number>(0);
  maxErrores = 6;
  pausado = signal<boolean>(false);
  tiempoSegundos = signal<number>(0);
  partidasGanadasSeguidas = signal<number>(0);
  comodines = signal<{id: string, tipo: string}[]>([]);

  letrasCorrectas = computed(() =>
    this.palabra().split('').filter(l => this.letrasUsadas().includes(l))
  );

  gano = computed(() =>
    this.palabra().length > 0 &&
    this.palabra().split('').every(l => this.letrasUsadas().includes(l))
  );

  perdio = computed(() => this.errores() >= this.maxErrores);

  juegoTerminado = computed(() => this.gano() || this.perdio());

  palabraVisible = computed(() =>
    this.palabra().split('').map(l => this.letrasUsadas().includes(l) ? l : '_')
  );

private ultimaPalabra = '';

async obtenerPalabra() {
  const { data } = await this.supabase.getClient()
    .from('palabras_ahorcado')
    .select('*');

  if (!data || data.length === 0) return;

  const disponibles = data.filter((p: any) => p.palabra !== this.ultimaPalabra);
  const item = disponibles[Math.floor(Math.random() * disponibles.length)];
  this.ultimaPalabra = item.palabra;
  this.palabra.set(item.palabra);
  this.descripcion.set(item.descripcion);
}

  elegirLetra(letra: string) {
    if (this.letrasUsadas().includes(letra) || this.juegoTerminado() || this.pausado()) return;
    this.letrasUsadas.update(l => [...l, letra]);
    if (!this.palabra().includes(letra)) {
      this.errores.update(e => e + 1);
    }
  }

  async nuevaPartida() {
    this.letrasUsadas.set([]);
    this.errores.set(0);
    this.pausado.set(false);
    this.tiempoSegundos.set(0);
    await this.obtenerPalabra();
  }

  async guardarResultado() {
    const usuario = this.auth.usuario();
    if (!usuario) return;

    const gano = this.gano();

    if (gano) {
      this.partidasGanadasSeguidas.update(n => n + 1);
    } else {
      this.partidasGanadasSeguidas.set(0);
    }

    await this.supabase.getClient().from('resultados_ahorcado').insert([{
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      palabra: this.palabra(),
      letras_seleccionadas: this.letrasUsadas().length,
      tiempo_segundos: this.tiempoSegundos(),
      gano
    }]);
  }

  async cargarComodines() {
    const usuario = this.auth.usuario();
    if (!usuario) return;
    const { data } = await this.supabase.getClient()
      .from('comodines_usuario')
      .select('*')
      .eq('usuario_id', usuario.id);
    this.comodines.set(data ?? []);
  }

  async ganarComodin(tipo: string) {
    const usuario = this.auth.usuario();
    if (!usuario) return;
    await this.supabase.getClient().from('comodines_usuario').insert([{
      usuario_id: usuario.id,
      tipo
    }]);
    await this.cargarComodines();
  }

  async usarComodin(id: string): Promise<string> {
    const comodin = this.comodines().find(c => c.id === id);
    if (!comodin) return '';

    await this.supabase.getClient().from('comodines_usuario').delete().eq('id', id);
    await this.cargarComodines();

    if (comodin.tipo === 'revelar_letra') {
      const letrasOcultas = this.palabra().split('').filter(l => !this.letrasUsadas().includes(l));
      if (letrasOcultas.length > 0) {
        const letra = letrasOcultas[Math.floor(Math.random() * letrasOcultas.length)];
        this.letrasUsadas.update(l => [...l, letra]);
        return letra;
      }
    }

    if (comodin.tipo === 'ver_descripcion') {
      return this.descripcion();
    }

    if (comodin.tipo === 'revelar_consonante') {
      const consonantes = 'BCDFGHJKLMNPQRSTVWXYZ';
      const consonantesOcultas = this.palabra().split('').filter(l =>
        consonantes.includes(l) && !this.letrasUsadas().includes(l)
      );
      if (consonantesOcultas.length > 0) {
        const letra = consonantesOcultas[Math.floor(Math.random() * consonantesOcultas.length)];
        this.letrasUsadas.update(l => [...l, letra]);
        return letra;
      }
    }

    return '';
  }
}