import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive  } from '@angular/router';
import { AuthService } from './services/authService/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink, RouterLinkActive ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Sala-de-juegos-primer-parcial');
  auth = inject(AuthService);
}
