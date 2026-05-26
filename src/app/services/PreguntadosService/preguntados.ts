import { Injectable, inject, signal } from '@angular/core';

import { Pregunta } from '../../models/pregunta.model';
import { AuthService } from '../authService/auth';
import { SupabaseService } from '../supabaseService/supabase';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  preguntas = signal<Pregunta[]>([]);
  preguntaActual = signal<Pregunta | null>(null);
  indicePregunta = signal(0);
  aciertos = signal(0);
  tiempoSegundos = signal(0);
  juegoTerminado = signal(false);
  gano = signal(false);
  cargando = signal(false);

  cantidadPreguntas = 10;

  async iniciarPartida() {
    this.preguntas.set([]);
    this.preguntaActual.set(null);
    this.indicePregunta.set(0);
    this.aciertos.set(0);
    this.tiempoSegundos.set(0);
    this.juegoTerminado.set(false);
    this.gano.set(false);

    await this.cargarPreguntas();
    this.cargarPreguntaActual();
  }

  async cargarPreguntas() {
    this.cargando.set(true);

    const { data, error } = await this.supabase
      .getClient()
      .from('preguntas_preguntados')
      .select('*');

    if (error || !data) {
      console.error(error);
      this.cargando.set(false);
      return;
    }

    const preguntas = (data as Pregunta[]).map(p => {

      const opciones = [
        p.opcion_1,
        p.opcion_2,
        p.opcion_3,
        p.opcion_4
      ];

      return {
        ...p,
        opciones: this.mezclarArray(opciones)
      };

    });

    this.preguntas.set(
      this.mezclarArray(preguntas)
        .slice(0, this.cantidadPreguntas)
    );

    this.cargando.set(false);
  }

  cargarPreguntaActual() {
    const pregunta = this.preguntas()[this.indicePregunta()];

    if (!pregunta) {
      this.finalizarVictoria();
      return;
    }

    this.preguntaActual.set(pregunta);
  }

  responder(opcion: string): boolean {
    const pregunta = this.preguntaActual();

    if (!pregunta || this.juegoTerminado()) return false;

    const esCorrecta = opcion === pregunta.correcta;

    if (esCorrecta) {
      this.aciertos.update(n => n + 1);
    }

    return esCorrecta;
  }

  siguientePregunta() {
    const nuevoIndice = this.indicePregunta() + 1;

    if (nuevoIndice >= this.preguntas().length) {
      this.finalizarVictoria();
      return;
    }

    this.indicePregunta.set(nuevoIndice);
    this.cargarPreguntaActual();
  }

  finalizarDerrota() {
    this.gano.set(false);
    this.juegoTerminado.set(true);
    this.guardarResultado();
  }

  finalizarVictoria() {
    this.gano.set(true);
    this.juegoTerminado.set(true);
    this.guardarResultado();
  }

  async guardarResultado() {
    const usuario = this.auth.usuario();

    if (!usuario) return;

    await this.supabase.getClient()
      .from('resultados_preguntados')
      .insert({
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        aciertos: this.aciertos(),
        preguntas_totales: this.preguntas().length,
        tiempo_segundos: this.tiempoSegundos()
      });
  }

  mezclarArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}