import { Component, OnInit, inject } from '@angular/core';
import { GithubService } from '../../services/github';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoyComponent implements OnInit {

  githubService = inject(GithubService);

  usuario = this.githubService.usuario;     
  cargando = this.githubService.cargando;    

  ngOnInit(): void {
    this.githubService.cargarUsuario();
  }
}