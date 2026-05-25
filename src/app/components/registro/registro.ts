import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  auth = inject(AuthService);
  error = signal('');
  cargando = signal(false);

  form = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]),
    edad: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(99)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/)
    ])
  });

  async onRegistro() {
    if (this.form.invalid) return;
    this.error.set('');
    this.cargando.set(true);
    const { nombre, apellido, edad, email, password } = this.form.value;
    const ok = await this.auth.registro(
      email!,
      password!,
      nombre!,
      apellido!,
      Number(edad)
    );
    if (!ok) this.error.set('El usuario ya existe o los datos son incorrectos');
    this.cargando.set(false);
  }

  get f() { return this.form.controls; }
}