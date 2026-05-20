import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-registro',
  imports: [FormsModule,RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  auth = inject(AuthService);

  nombre = '';
  apellido = '';
  edad = '';
  email = '';
  password = '';
  error = signal('');
  cargando = signal(false);

  async onRegistro() {
    this.error.set('');
    this.cargando.set(true);
    const ok = await this.auth.registro(
      this.email,
      this.password,
      this.nombre,
      this.apellido,
      Number(this.edad)
    );
    if (!ok) this.error.set('El usuario ya existe o los datos son incorrectos');
    this.cargando.set(false);
  }
}