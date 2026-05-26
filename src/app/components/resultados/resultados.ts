import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResultadosService } from '../../services/resultadosService/resultados';

type Juego = 'ahorcado' | 'mayor-menor' | 'preguntados' | 'sopa-letras';

@Component({
  selector: 'app-resultados',
  imports: [RouterLink],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {

  resultadosService = inject(ResultadosService);

  juegoActivo = signal<Juego>('ahorcado');

  paginaActual = signal(1);

  resultadosPorPagina = 5;

  async ngOnInit() {
    await this.resultadosService.cargarResultados();
  }

  cambiarJuego(juego: Juego) {
    this.juegoActivo.set(juego);
    this.paginaActual.set(1);
  }

  resultadosActuales = computed(() => {
    switch (this.juegoActivo()) {
      case 'ahorcado':
        return this.resultadosService.resultadosAhorcado();

      case 'mayor-menor':
        return this.resultadosService.resultadosMayorMenor();

      case 'preguntados':
        return this.resultadosService.resultadosPreguntados();

      case 'sopa-letras':
        return this.resultadosService.resultadosSopaLetras();

      default:
        return [];
    }
  });

  totalPaginas = computed(() => {
    return Math.ceil(
      this.resultadosActuales().length / this.resultadosPorPagina
    );
  });

  resultadosPaginados = computed(() => {
    const inicio =
      (this.paginaActual() - 1) * this.resultadosPorPagina;

    const fin =
      inicio + this.resultadosPorPagina;

    return this.resultadosActuales().slice(inicio, fin);
  });

  paginaAnterior() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update(p => p - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update(p => p + 1);
    }
  }
}