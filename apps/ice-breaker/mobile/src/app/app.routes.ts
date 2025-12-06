import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { GamesComponent } from './games.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'games',
    component: GamesComponent,
    canActivate: [authGuard],
  },
];
