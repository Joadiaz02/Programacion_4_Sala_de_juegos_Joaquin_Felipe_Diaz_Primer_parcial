import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from './services/authService/auth';
import { ChatGlobal } from './components/chat-global/chat-global';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ChatGlobal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title =
    signal('Sala-de-juegos-primer-parcial');

  auth = inject(AuthService);

}