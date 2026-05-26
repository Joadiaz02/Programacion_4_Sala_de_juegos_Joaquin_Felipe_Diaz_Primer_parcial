import { Injectable, inject, signal, computed } from '@angular/core';

import { AuthService } from '../authService/auth';
import { SupabaseService } from '../supabaseService/supabase';

@Injectable({
  providedIn: 'root'
})
export class SopaLetrasService {

  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  grilla = signal<string[][]>([]);
  palabras = signal<string[]>([]);
  encontradas = signal<string[]>([]);
  tiempoSegundos = signal(0);
  juegoTerminado = signal(false);

  palabrasEncontradas = computed(() => this.encontradas().length);
  palabrasTotales = computed(() => this.palabras().length);

  iniciarPartida() {
    const palabrasBase = [
      'ANGULAR',
      'SUPABASE',
      'TYPESCRIPT',
      'GITHUB',
      'JUEGO'
    ];

    this.palabras.set(palabrasBase);
    this.encontradas.set([]);
    this.tiempoSegundos.set(0);
    this.juegoTerminado.set(false);

    this.generarGrilla(palabrasBase);
  }

  generarGrilla(palabras: string[]) {
    const tamaño = 12;

    const grilla = Array.from(
      { length: tamaño },
      () => Array(tamaño).fill('')
    );

    for (const palabra of palabras) {
      this.colocarPalabra(grilla, palabra);
    }

    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

    for (let fila = 0; fila < tamaño; fila++) {
      for (let col = 0; col < tamaño; col++) {
        if (grilla[fila][col] === '') {
          grilla[fila][col] = letras[Math.floor(Math.random() * letras.length)];
        }
      }
    }

    this.grilla.set(grilla);
  }

  colocarPalabra(grilla: string[][], palabra: string) {
    const tamaño = grilla.length;
    let colocada = false;

    while (!colocada) {
      const horizontal = Math.random() > 0.5;
      const fila = Math.floor(Math.random() * tamaño);
      const col = Math.floor(Math.random() * tamaño);

      if (horizontal) {
        if (col + palabra.length > tamaño) continue;

        let puede = true;

        for (let i = 0; i < palabra.length; i++) {
          if (
            grilla[fila][col + i] !== '' &&
            grilla[fila][col + i] !== palabra[i]
          ) {
            puede = false;
            break;
          }
        }

        if (!puede) continue;

        for (let i = 0; i < palabra.length; i++) {
          grilla[fila][col + i] = palabra[i];
        }

        colocada = true;

      } else {
        if (fila + palabra.length > tamaño) continue;

        let puede = true;

        for (let i = 0; i < palabra.length; i++) {
          if (
            grilla[fila + i][col] !== '' &&
            grilla[fila + i][col] !== palabra[i]
          ) {
            puede = false;
            break;
          }
        }

        if (!puede) continue;

        for (let i = 0; i < palabra.length; i++) {
          grilla[fila + i][col] = palabra[i];
        }

        colocada = true;
      }
    }
  }

  verificarSeleccion(
    filaInicio: number,
    colInicio: number,
    filaFin: number,
    colFin: number
  ): string {

    if (this.juegoTerminado()) return '';

    const letras = this.obtenerLetrasSeleccionadas(
      filaInicio,
      colInicio,
      filaFin,
      colFin
    );

    const palabra = letras.join('');
    const palabraInvertida = letras.reverse().join('');

    const encontrada =
      this.palabras().find(p =>
        p === palabra || p === palabraInvertida
      );

    if (
      encontrada &&
      !this.encontradas().includes(encontrada)
    ) {
      this.encontradas.update(lista => [...lista, encontrada]);

      if (this.encontradas().length === this.palabras().length) {
        this.finalizarPartida();
      }

      return encontrada;
    }

    return '';
  }

  obtenerLetrasSeleccionadas(
    filaInicio: number,
    colInicio: number,
    filaFin: number,
    colFin: number
  ): string[] {

    const grilla = this.grilla();

    const letras: string[] = [];

    const mismaFila = filaInicio === filaFin;
    const mismaColumna = colInicio === colFin;

    if (!mismaFila && !mismaColumna) {
      return [];
    }

    if (mismaFila) {
      const inicio = Math.min(colInicio, colFin);
      const fin = Math.max(colInicio, colFin);

      for (let col = inicio; col <= fin; col++) {
        letras.push(grilla[filaInicio][col]);
      }
    }

    if (mismaColumna) {
      const inicio = Math.min(filaInicio, filaFin);
      const fin = Math.max(filaInicio, filaFin);

      for (let fila = inicio; fila <= fin; fila++) {
        letras.push(grilla[fila][colInicio]);
      }
    }

    return letras;
  }

  obtenerCoordenadasSeleccionadas(
    filaInicio: number,
    colInicio: number,
    filaFin: number,
    colFin: number
  ) {
    const coordenadas: { fila: number; col: number }[] = [];

    const mismaFila = filaInicio === filaFin;
    const mismaColumna = colInicio === colFin;

    if (!mismaFila && !mismaColumna) {
      return coordenadas;
    }

    if (mismaFila) {
      const inicio = Math.min(colInicio, colFin);
      const fin = Math.max(colInicio, colFin);

      for (let col = inicio; col <= fin; col++) {
        coordenadas.push({ fila: filaInicio, col });
      }
    }

    if (mismaColumna) {
      const inicio = Math.min(filaInicio, filaFin);
      const fin = Math.max(filaInicio, filaFin);

      for (let fila = inicio; fila <= fin; fila++) {
        coordenadas.push({ fila, col: colInicio });
      }
    }

    return coordenadas;
  }

  finalizarPartida() {
    if (this.juegoTerminado()) return;

    this.juegoTerminado.set(true);
    this.guardarResultado();
  }

  async guardarResultado() {
    const usuario = this.auth.usuario();

    if (!usuario) return;

    await this.supabase.getClient()
      .from('resultados_sopa_letras')
      .insert({
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        palabras_encontradas: this.encontradas().length,
        palabras_totales: this.palabras().length,
        tiempo_segundos: this.tiempoSegundos()
      });
  }
}