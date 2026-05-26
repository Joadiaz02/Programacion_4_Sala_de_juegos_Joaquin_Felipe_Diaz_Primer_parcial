import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { SopaLetrasService } from '../../services/sopaLetrasService/sopa-letras';

@Component({
  selector: 'app-sopa-letras',
  imports: [
    RouterLink
  ],
  templateUrl: './sopa-letras.html',
  styleUrl: './sopa-letras.css'
})
export class SopaLetras implements OnInit, OnDestroy {

  sopaService = inject(SopaLetrasService);

  mensaje = signal('');

  seleccionInicio = signal<{ fila: number; col: number } | null>(null);

  celdasSeleccionadas = signal<{ fila: number; col: number }[]>([]);

  celdasEncontradas = signal<{ fila: number; col: number }[]>([]);

  private timer: any;

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  iniciarJuego() {
    clearInterval(this.timer);

    this.mensaje.set('');
    this.seleccionInicio.set(null);
    this.celdasSeleccionadas.set([]);
    this.celdasEncontradas.set([]);

    this.sopaService.iniciarPartida();

    this.iniciarTimer();
  }

  iniciarTimer() {
    this.timer = setInterval(() => {
      if (!this.sopaService.juegoTerminado()) {
        this.sopaService.tiempoSegundos.update(t => t + 1);
      }
    }, 1000);
  }

  seleccionarCelda(fila: number, col: number) {
    if (this.sopaService.juegoTerminado()) return;

    const inicio = this.seleccionInicio();

    if (!inicio) {
      this.seleccionInicio.set({ fila, col });
      this.celdasSeleccionadas.set([{ fila, col }]);
      this.mensaje.set('Seleccioná la última letra de la palabra');
      return;
    }

    const coordenadas =
      this.sopaService.obtenerCoordenadasSeleccionadas(
        inicio.fila,
        inicio.col,
        fila,
        col
      );

    if (coordenadas.length === 0) {
      this.mensaje.set('Solo podés seleccionar en horizontal o vertical');
      this.seleccionInicio.set(null);
      this.celdasSeleccionadas.set([]);
      return;
    }

    this.celdasSeleccionadas.set(coordenadas);

    const palabraEncontrada =
      this.sopaService.verificarSeleccion(
        inicio.fila,
        inicio.col,
        fila,
        col
      );

    if (palabraEncontrada) {
      this.mensaje.set(`Encontraste: ${palabraEncontrada}`);

      this.celdasEncontradas.update(actuales => [
        ...actuales,
        ...coordenadas
      ]);

      if (this.sopaService.juegoTerminado()) {
        clearInterval(this.timer);
      }

    } else {
      this.mensaje.set('No hay una palabra válida en esa selección');
    }

    this.seleccionInicio.set(null);

    setTimeout(() => {
      this.celdasSeleccionadas.set([]);
    }, 700);
  }

  celdaSeleccionada(fila: number, col: number): boolean {
    return this.celdasSeleccionadas()
      .some(c => c.fila === fila && c.col === col);
  }

  celdaEncontrada(fila: number, col: number): boolean {
    return this.celdasEncontradas()
      .some(c => c.fila === fila && c.col === col);
  }

  terminarPartida() {
    clearInterval(this.timer);
    this.sopaService.finalizarPartida();
  }

  jugarDeNuevo() {
    this.iniciarJuego();
  }
}