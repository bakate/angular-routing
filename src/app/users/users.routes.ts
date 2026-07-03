import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: {
      title: 'Liste des users',
      topic: 'feature lazy-loadée',
      why: 'Afficher une liste filtrable sans charger la feature au démarrage.',
    },
  },
  {
    path: ':userId',
    loadComponent: () =>
      import('./user-detail/user-detail.component').then(
        (module) => module.UserDetailComponent
      ),
    data: {
      title: 'Détail user',
      topic: 'segment de route dynamique',
      why: 'Résoudre une page depuis le segment `:userId`.',
    },
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      {
        path: 'info',
        loadComponent: () =>
          import('./user-detail/user-info-route.component').then(
            (module) => module.UserInfoRouteComponent
          ),
        data: {
          title: 'Infos user',
          topic: 'route enfant info',
          why: 'Changer une sous-vue sans quitter le détail user.',
        },
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./user-detail/user-activity-route.component').then(
            (module) => module.UserActivityRouteComponent
          ),
        data: {
          title: 'Activité user',
          topic: 'route enfant activity',
          why: 'Garder le contexte user pendant que la sous-vue change.',
        },
      },
      {
        path: 'error-lab',
        loadComponent: () =>
          import('./user-detail/user-error-lab-route.component').then(
            (module) => module.UserErrorLabRouteComponent
          ),
        data: {
          title: 'Erreur locale user',
          topic: 'capture locale',
          why: "Montrer qu'une erreur attendue doit être capturée au point d'appel.",
        },
      },
    ],
  },
];
