import { Component, inject, OnInit } from '@angular/core';
import { MayorMenorService } from '../../services/mayorMenorService/mayor-menor';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {

  juego = inject(MayorMenorService);

  ngOnInit() {

    this.juego.iniciarJuego();

  }

  mostrarValor(valor: number | undefined): string {

    if (valor === undefined) {

      return '';

    }

    return this.juego.mostrarValor(valor);

  }

}