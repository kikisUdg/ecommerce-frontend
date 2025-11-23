import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { guestGuard } from './pages/auth/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
  },

  { path: '**', redirectTo: '' }
];