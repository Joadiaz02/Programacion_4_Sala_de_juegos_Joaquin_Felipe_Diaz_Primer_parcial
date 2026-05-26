import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { PreguntadosService } from '../../services/PreguntadosService/preguntados';

@Component({
  selector: 'app-preguntados',
  imports: [RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit, OnDestroy {

  preguntadosService = inject(PreguntadosService);

  private timer: any;

  mostrarModalCorrecto = signal(false);
  mostrarModalDerrota = signal(false);

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  async iniciarJuego() {
    clearInterval(this.timer);

    this.mostrarModalCorrecto.set(false);
    this.mostrarModalDerrota.set(false);

    await this.preguntadosService.iniciarPartida();

    this.iniciarTimer();
  }

  iniciarTimer() {
    this.timer = setInterval(() => {
      if (!this.preguntadosService.juegoTerminado()) {
        this.preguntadosService.tiempoSegundos.update(t => t + 1);
      }
    }, 1000);
  }

  responder(opcion: string) {
    const correcta = this.preguntadosService.responder(opcion);

    if (correcta) {
      this.mostrarModalCorrecto.set(true);
    } else {
      clearInterval(this.timer);
      this.preguntadosService.finalizarDerrota();
      this.mostrarModalDerrota.set(true);
    }
  }

  siguientePregunta() {
    this.mostrarModalCorrecto.set(false);

    this.preguntadosService.siguientePregunta();

    if (this.preguntadosService.juegoTerminado()) {
      clearInterval(this.timer);
    }
  }

  terminarPartida() {
    clearInterval(this.timer);
    this.mostrarModalCorrecto.set(false);
    this.preguntadosService.finalizarVictoria();
  }

  async jugarDeNuevo() {
    await this.iniciarJuego();
  }
}