import { Routes } from '@angular/router';
import { Login } from './core/login/login';
import { Dashboard } from 'src/app/core/dashboard/dashboard';
import { EmergencyPage } from 'src/app/features/emergency-page/emergency-page';
import { authGuard } from 'src/app/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'emergency/:id', component: EmergencyPage },
];
