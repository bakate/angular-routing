import { Routes } from '@angular/router';
import {
  adminChildrenGuard,
  unsavedChangesGuard,
} from '../auth/auth.guards';
import { DashboardShellComponent } from './dashboard-shell.component';
import { DashboardSettingsService } from './settings/dashboard-settings.service';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    canActivateChild: [adminChildrenGuard],
    providers: [DashboardSettingsService],
    data: {
      title: 'Structure dashboard',
      requiresAdmin: true,
      guard: 'CanActivateChild',
      why: 'Centraliser la protection des routes enfants admin.',
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/dashboard-home.component').then(
            (module) => module.DashboardHomeComponent
          ),
        data: {
          title: 'Accueil dashboard',
          requiresAdmin: true,
          why: 'Point d’entrée visible après validation CanActivate.',
        },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/dashboard-users.component').then(
            (module) => module.DashboardUsersComponent
          ),
        data: {
          title: 'Users dashboard',
          requiresAdmin: true,
          why: 'Montrer que CanActivateChild protège aussi les enfants.',
        },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/dashboard-settings.component').then(
            (module) => module.DashboardSettingsComponent
          ),
        canDeactivate: [unsavedChangesGuard],
        data: {
          title: 'Paramètres dashboard',
          requiresAdmin: true,
          guard: 'CanDeactivate',
          why: 'Protéger la sortie quand le formulaire contient des modifications.',
        },
      },
    ],
  },
];
