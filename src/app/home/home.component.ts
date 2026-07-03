import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface RouterPrimitive {
  readonly name: string;
  readonly summary: string;
  readonly code: string;
}

interface DemoStep {
  readonly order: string;
  readonly title: string;
  readonly route: string;
  readonly actionLabel: string;
  readonly description: string;
  readonly code: string;
}

@Component({
  selector: 'home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  protected readonly routerEssentialsSnippet = `export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', loadChildren: () => import('./users/users.routes') },
  { path: 'dashboard', canActivate: [adminCanActivateGuard] },
];

<router-outlet></router-outlet>

<a [routerLink]="['/users']">Users</a>`;

  protected readonly routerPrimitives: RouterPrimitive[] = [
    {
      name: 'Routes',
      summary:
        "Une route relie une URL à un composant, une redirection, ou une feature lazy-loadée.",
      code: `{ path: 'users', loadChildren: loadUsersRoutes }`,
    },
    {
      name: 'Outlet',
      summary:
        "Un outlet marque l'endroit où Angular rend le composant de la route active.",
      code: `<router-outlet></router-outlet>`,
    },
    {
      name: 'Links',
      summary:
        'Un routerLink change de route côté client, sans recharger toute la page.',
      code: `<a [routerLink]="['/users', user.id]">Ouvrir user</a>`,
    },
    {
      name: 'Guards',
      summary:
        "Un guard décide si une route peut être sélectionnée, activée, ou quittée selon l'état courant.",
      code: `{ path: 'dashboard', canActivate: [adminCanActivateGuard] }`,
    },
  ];

  protected readonly demoSteps: DemoStep[] = [
    {
      order: '01',
      title: 'Comprendre la route map',
      route: '/home',
      actionLabel: 'Rester sur la home',
      description:
        "Commence par la configuration globale : redirection initiale, pages directes, features lazy-loadées, guards et wildcard.",
      code: `{ path: '', redirectTo: 'home', pathMatch: 'full' }
{ path: 'users', loadChildren: () => import('./users/users.routes') }
{ path: 'dashboard', canActivate: [adminCanActivateGuard] }
{ path: '**', component: NotFoundComponent }`,
    },
    {
      order: '02',
      title: 'Charger `/users` à la demande',
      route: '/users',
      actionLabel: 'Ouvrir Users',
      description:
        "La page liste est lazy-loadée avec `loadChildren`. Elle affiche des users générés par `UsersService`, puis construit des liens dynamiques.",
      code: `{
  path: 'users',
  loadChildren: () => import('./users/users.routes'),
}`,
    },
    {
      order: '03',
      title: 'Naviguer vers une page dynamique',
      route: '/users',
      actionLabel: 'Choisir un user',
      description:
        "Depuis `/users`, clique une carte. Angular construit une URL comme `/users/1` grâce au segment dynamique `:userId`.",
      code: `{
  path: '',
  component: UserListComponent,
},
{
  path: ':userId',
  loadComponent: () => import('./user-detail/user-detail.component'),
}`,
    },
    {
      order: '04',
      title: 'Changer une sous-vue sans quitter le détail',
      route: '/users/1/info',
      actionLabel: 'Voir nested routes',
      description:
        "Sur `/users/:userId`, les informations principales du user restent visibles pendant que `/info` et `/activity` changent dans l'outlet enfant.",
      code: `<user-details-card [user]="user" />
<router-outlet></router-outlet>`,
    },
    {
      order: '05',
      title: 'Simuler une authentification par rôle',
      route: '/login',
      actionLabel: 'Choisir un rôle',
      description:
        "Choisis `admin` ou `contributor`. Le rôle est persisté dans `AuthService`, puis les guards lisent cet état pour prendre leurs décisions.",
      code: `type UserRole = 'admin' | 'contributor';
type AuthState = Readonly<{ role: UserRole | null }>;`,
    },
    {
      order: '06',
      title: 'Tester CanActivate et CanActivateChild',
      route: '/dashboard',
      actionLabel: 'Ouvrir le dashboard',
      description:
        "`CanActivate` protège l'entrée `/dashboard`. `CanActivateChild` protège ensuite `/dashboard/home`, `/dashboard/users` et `/dashboard/settings` sans répéter la règle.",
      code: `{ path: 'dashboard', canActivate: [adminCanActivateGuard] }
{ path: '', canActivateChild: [adminChildrenGuard] }`,
    },
    {
      order: '07',
      title: 'Tester CanDeactivate et CanMatch',
      route: '/reports',
      actionLabel: 'Ouvrir les rapports',
      description:
        "`CanDeactivate` protège le formulaire settings contre la perte de données. `CanMatch` montre que `/reports` peut charger un composant différent selon le rôle.",
      code: `{ path: 'reports', canMatch: [adminReportsCanMatchGuard] }
{ path: 'reports', canMatch: [contributorReportsCanMatchGuard] }`,
    },
    {
      order: '08',
      title: 'Capturer une URL inconnue',
      route: '/route-inconnue-demo',
      actionLabel: 'Tester la 404',
      description:
        "Ajoute n'importe quel string à l'URL. Si aucune route ne matche, Angular tombe sur le wildcard `**` placé en dernier.",
      code: `{ path: '**', component: NotFoundComponent }`,
    },
  ];
}
