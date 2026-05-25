import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AhorcadoService } from '../../services/ahorcadoService/ahorcado';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit, OnDestroy {

  ahorcadoService = inject(AhorcadoService);
  auth = inject(AuthService);

  private timer: any;
  mostrarModalComodin = false;
  mostrarDescripcion = false;
  descripcionComodin = '';
  comodinUsadoEnPartida = false;

  abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  async iniciarJuego() {
    await this.ahorcadoService.nuevaPartida();
    await this.ahorcadoService.cargarComodines();
    this.iniciarTimer();
    this.comodinUsadoEnPartida = false;
    this.mostrarDescripcion = false;
  }

  iniciarTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.ahorcadoService.pausado() && !this.ahorcadoService.juegoTerminado()) {
        this.ahorcadoService.tiempoSegundos.update(t => t + 1);
      }
    }, 1000);
  }

  elegirLetra(letra: string) {
  if (this.ahorcadoService.juegoTerminado()) return;
  const eraCorrecta = this.ahorcadoService.palabra().includes(letra);
  this.ahorcadoService.elegirLetra(letra);
  this.reproducirSonido(eraCorrecta ? 'correcto' : 'incorrecto');

  if (this.ahorcadoService.juegoTerminado()) {
    clearInterval(this.timer);
    this.ahorcadoService.guardarResultado().then(() => {
      if (this.ahorcadoService.partidasGanadasSeguidas() > 0 &&
          this.ahorcadoService.partidasGanadasSeguidas() % 3 === 0) {
        this.mostrarModalComodin = true;
      }
    });
  }
}

  reproducirSonido(tipo: 'correcto' | 'incorrecto') {
    const sonido = new Audio(`/assets/sounds/${tipo}.mp3`);
    sonido.play().catch(() => {});
  }

  togglePausa() {
    this.ahorcadoService.pausado.update(p => !p);
  }

  async elegirComodin(tipo: string) {
    this.mostrarModalComodin = false;
    await this.ahorcadoService.ganarComodin(tipo);
  }

  async usarComodin(id: string, tipo: string) {
    if (this.comodinUsadoEnPartida) return;
    this.comodinUsadoEnPartida = true;
    const resultado = await this.ahorcadoService.usarComodin(id);
    if (tipo === 'ver_descripcion') {
      this.mostrarDescripcion = true;
      this.descripcionComodin = resultado;
    }
  }

  comodinesAgrupados = computed(() => {

  const agrupados: {
    tipo: string;
    cantidad: number;
    id: string;
  }[] = [];

  for (const comodin of this.ahorcadoService.comodines()) {

    const existente =
      agrupados.find(
        c => c.tipo === comodin.tipo
      );

    if (existente) {

      existente.cantidad++;

    } else {

      agrupados.push({
        tipo: comodin.tipo,
        cantidad: 1,
        id: comodin.id
      });

    }

  }

  return agrupados;

});

  async jugarDeNuevo() {
    clearInterval(this.timer);
    await this.iniciarJuego();
  }
}