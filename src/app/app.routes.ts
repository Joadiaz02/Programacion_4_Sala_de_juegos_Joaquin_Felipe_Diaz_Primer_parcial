import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';
import { Ahorcado } from './components/ahorcado/ahorcado';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registro',
    component: Registro
  },
  {
  path: 'quien-soy',
  component: QuienSoyComponent,
  canActivate: [authGuard]
  },
  {
  path: 'ahorcado',
  component: Ahorcado,
  canActivate: [authGuard]
  }
];