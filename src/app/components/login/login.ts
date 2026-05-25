import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  auth = inject(AuthService);
  error = signal('');
  cargando = signal(false);

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  async onLogin() {
    if (this.form.invalid) return;
    this.error.set('');
    this.cargando.set(true);
    const { email, password } = this.form.value;
    const ok = await this.auth.login(email!, password!);
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

  get f() { return this.form.controls; }
}