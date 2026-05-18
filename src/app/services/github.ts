import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private url = 'https://api.github.com/users/Joadiaz02';
  private http = inject(HttpClient);

  usuario = signal<any>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  async cargarUsuario() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(this.http.get(this.url));
      this.usuario.set(data);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.cargando.set(false);
    }
  }
}