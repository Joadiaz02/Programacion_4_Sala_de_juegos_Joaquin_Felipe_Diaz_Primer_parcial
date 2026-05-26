import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';
import { Ahorcado } from './components/ahorcado/ahorcado';
import { MayorMenor } from './components/mayor-menor/mayor-menor';
import { Preguntados } from './components/preguntados/preguntados';
import { SopaLetras } from './components/sopa-letras/sopa-letras';

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
  },
  {
  path: 'mayor-menor',
  component: MayorMenor,
  canActivate: [authGuard]
  },
  {
  path: 'preguntados',
  component: Preguntados,
  canActivate: [authGuard]
},
{
  path: 'sopa-letras',
  component: SopaLetras,
  canActivate: [authGuard]
}
];