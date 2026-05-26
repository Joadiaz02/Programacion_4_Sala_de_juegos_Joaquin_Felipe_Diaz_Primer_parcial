import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../supabaseService/supabase';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  private supabase = inject(SupabaseService);

  resultadosAhorcado = signal<any[]>([]);
  resultadosMayorMenor = signal<any[]>([]);
  resultadosPreguntados = signal<any[]>([]);
  resultadosSopaLetras = signal<any[]>([]);

  async cargarResultados() {
    await Promise.all([
      this.cargarAhorcado(),
      this.cargarMayorMenor(),
      this.cargarPreguntados(),
      this.cargarSopaLetras()
    ]);
  }

  async cargarAhorcado() {
    const { data } = await this.supabase
      .getClient()
      .from('resultados_ahorcado')
      .select('*')
      .order('gano', { ascending: false })
      .order('tiempo_segundos', { ascending: true });

    this.resultadosAhorcado.set(data ?? []);
  }

  async cargarMayorMenor() {
    const { data } = await this.supabase
      .getClient()
      .from('resultados_mayor_menor')
      .select('*')
      .order('cartas_acertadas', { ascending: false })
      .order('tiempo_segundos', { ascending: true });

    this.resultadosMayorMenor.set(data ?? []);
  }

  async cargarPreguntados() {
    const { data } = await this.supabase
      .getClient()
      .from('resultados_preguntados')
      .select('*')
      .order('aciertos', { ascending: false })
      .order('tiempo_segundos', { ascending: true });

    this.resultadosPreguntados.set(data ?? []);
  }

  async cargarSopaLetras() {
    const { data } = await this.supabase
      .getClient()
      .from('resultados_sopa_letras')
      .select('*')
      .order('palabras_encontradas', { ascending: false })
      .order('tiempo_segundos', { ascending: true });

    this.resultadosSopaLetras.set(data ?? []);
  }
}