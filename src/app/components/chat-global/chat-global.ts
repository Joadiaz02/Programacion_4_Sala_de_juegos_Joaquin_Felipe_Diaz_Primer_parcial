import {
  Component,
  inject,
  signal,
  effect
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ChatService } from '../../services/chatService/chat';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-chat-global',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-global.html',
  styleUrl: './chat-global.css'
})
export class ChatGlobal {

  chat = inject(ChatService);

  auth = inject(AuthService);

  abierto = signal(false);

  nuevoMensaje = '';

  mensajesNoVistos = signal(0);

  private cantidadAnterior = 0;

  constructor() {

    effect(() => {

      const cantidadActual =
        this.chat.mensajes().length;

      if (
        this.cantidadAnterior > 0 &&
        cantidadActual > this.cantidadAnterior &&
        !this.abierto()
      ) {

        this.mensajesNoVistos.update(
          valor =>
            valor +
            (cantidadActual - this.cantidadAnterior)
        );

      }

      this.cantidadAnterior =
        cantidadActual;

    });

  }

  toggleChat() {

    this.abierto.update(
      valor => !valor
    );

    if (this.abierto()) {

      this.mensajesNoVistos.set(0);

    }

  }

  async enviar() {

    const texto =
      this.nuevoMensaje.trim();

    if (!texto) return;

    await this.chat.enviarMensaje(
      texto
    );

    this.nuevoMensaje = '';

  }

  esMio(usuarioId: string) {

    return usuarioId ===
      this.auth.usuario()?.id;

  }

  formatearFechaHora(fecha: string): string {

    return new Date(fecha)
      .toLocaleString(
        'es-AR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }

}