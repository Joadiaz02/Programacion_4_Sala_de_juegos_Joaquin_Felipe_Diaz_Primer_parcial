import { Injectable, inject, signal } from '@angular/core';
import { Carta } from '../../models/carta.model';
import { SupabaseService } from '../supabaseService/supabase';
import { AuthService } from '../authService/auth';

@Injectable({
  providedIn: 'root'
})
export class MayorMenorService {

  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  mazo = signal<Carta[]>([]);

  cartaActual = signal<Carta | null>(null);

  cartasAcertadas = signal(0);

  partidaTerminada = signal(false);

  tiempoSegundos = signal(0);

  private intervalo: any;

  private generarMazo(): Carta[] {

    const cartas: Carta[] = [];

    const palos = ['♠', '♥', '♦', '♣'];

    for (let palo of palos) {

      for (let valor = 1; valor <= 13; valor++) {

        cartas.push({
          valor,
          palo
        });

      }

    }

    return cartas;
  }

  private mezclarMazo(cartas: Carta[]): Carta[] {

    return cartas.sort(
      () => Math.random() - 0.5
    );

  }

  iniciarJuego() {

    clearInterval(this.intervalo);

    const mazo = this.mezclarMazo(
      this.generarMazo()
    );

    this.mazo.set(mazo);

    this.cartaActual.set(
      mazo[0]
    );

    this.cartasAcertadas.set(0);

    this.partidaTerminada.set(false);

    this.tiempoSegundos.set(0);

    this.intervalo = setInterval(() => {

      if (!this.partidaTerminada()) {

        this.tiempoSegundos.update(
          t => t + 1
        );

      }

    }, 1000);

  }

  elegirMayor() {

    this.verificar(true);

  }

  elegirMenor() {

    this.verificar(false);

  }

  private verificar(esMayor: boolean) {

    if (this.partidaTerminada()) {

      return;

    }

    const mazo = [...this.mazo()];

    if (mazo.length < 2) {

      this.partidaTerminada.set(true);

      clearInterval(this.intervalo);

      this.guardarResultado();

      return;

    }

    const actual = mazo[0];

    const siguiente = mazo[1];

    const acerto = esMayor
      ? siguiente.valor >= actual.valor
      : siguiente.valor <= actual.valor;

    if (acerto) {

      this.cartasAcertadas.update(
        x => x + 1
      );

      mazo.shift();

      this.mazo.set(mazo);

      this.cartaActual.set(
        mazo[0]
      );

    }
    else {

      this.partidaTerminada.set(true);

      clearInterval(this.intervalo);

      this.guardarResultado();

    }

  }

  mostrarValor(valor: number): string {

    switch (valor) {

      case 1:
        return 'A';

      case 11:
        return 'J';

      case 12:
        return 'Q';

      case 13:
        return 'K';

      default:
        return valor.toString();
    }

  }

  async guardarResultado() {

    const usuario = this.auth.usuario();

    if (!usuario) return;

    const { error } = await this.supabase
      .getClient()
      .from('resultados_mayor_menor')
      .insert({
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        cartas_acertadas: this.cartasAcertadas(),
        tiempo_segundos: this.tiempoSegundos()
      });

    if (error) {

      console.error(error);

    }

  }

}