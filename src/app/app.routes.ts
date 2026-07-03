import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {
  adminCanActivateGuard,
  adminReportsCanMatchGuard,
  contributorReportsCanMatchGuard,
} from './auth/auth.guards';

export const routes: Routes = [
  { path: '',  pathMatch: 'full' , 
     component: HomeComponent,
     title: "Page d'accueil",
    data: {
      title: "Vue d'ensemble",
      topic: 'modèle mental du router',
      why: 'Donner une carte de lecture avant les détails.',
    },},
  {
    path: 'home',
    redirectTo: ""
   
  },
  {
    path: 'architecture',
    component: ArchitectureComponent,
    data: { title: 'Architecture', topic: 'décisions de routing' },
  },
  {
    path: 'login',
    title: 'Connexion',
    loadComponent: () =>
      import('./auth/login/login.component').then(
        (module) => module.LoginComponent
      ),
    data: {
      title: 'Connexion',
      topic: 'choix de rôle simulé',
      why: 'Créer un état utilisateur simple pour tester les guards.',
    },

  },
  {
    path: 'dashboard',
    canActivate: [adminCanActivateGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(
        (module) => module.DASHBOARD_ROUTES
      ),
      title: "Dashboard",
    data: {
      title: 'Dashboard',
      requiresAdmin: true,
      guard: 'CanActivate',
      why: "Empêcher l'activation de la feature admin sans le bon rôle.",
    },
  },
  {
    path: 'contributor',
    title: "Espace contributor",
    loadComponent: () =>
      import('./contributor/contributor.component').then(
        (module) => module.ContributorComponent
      ),
    data: { title: 'Espace contributor', role: 'contributor' },
  },
  {
    path: 'reports',
    title: "Rapports admin",
    canMatch: [adminReportsCanMatchGuard],
    loadComponent: () =>
      import('./reports/admin/admin-reports.component').then(
        (module) => module.AdminReportsComponent
      ),
    data: {
      title: 'Rapports admin',
      role: 'admin',
      guard: 'CanMatch',
      why: 'Sélectionner la version admin de la même URL logique.',
    },
  },
  {
    path: 'reports',
    title: "Rapports contributor",
    canMatch: [contributorReportsCanMatchGuard],
    loadComponent: () =>
      import('./reports/contributor/contributor-reports.component').then(
        (module) => module.ContributorReportsComponent
      ),
    data: {
      title: 'Rapports contributor',
      role: 'contributor',
      guard: 'CanMatch',
      why: 'Laisser Angular continuer le matching vers la route contributor.',
    },
  },
  { path: 'reports', redirectTo: 'login' },
  { path: 'contacts', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.routes').then((module) => module.USERS_ROUTES),
    data: {
      title: 'Users',
      topic: 'lazy loading et routes dynamiques',
      why: 'Charger la liste seulement quand la feature est visitée.',
    },
  },
  { path: '**', component: NotFoundComponent, title: "Page non trouvée" },
];
