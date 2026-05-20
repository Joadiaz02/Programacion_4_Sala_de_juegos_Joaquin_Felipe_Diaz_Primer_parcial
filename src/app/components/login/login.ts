import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  auth = inject(AuthService);

  emailValue = '';
  passwordValue = '';
  error = signal('');
  cargando = signal(false);

  async onLogin() {
    this.error.set('');
    this.cargando.set(true);
    const ok = await this.auth.login(this.emailValue, this.passwordValue);
    if (!ok) this.error.set('Email o contraseña incorrectos');
    this.cargando.set(false);
  }

  async loginRapido(email: string, password: string) {
    this.error.set('');
    this.cargando.set(true);
    const ok = await this.auth.login(email, password);
    if (!ok) this.error.set('Error al iniciar sesión');
    this.cargando.set(false);
  }
}