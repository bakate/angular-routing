import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'user-list',
  imports: [RouterLink, CodeSnippetComponent, ConceptCardListComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  private readonly usersService = inject(UsersService);
  private readonly searchQuery = signal('');

  protected readonly users: User[] = this.usersService.getAllUsers();
  protected readonly routeWhyCards: readonly ConceptCard[] = [
    {
      title: 'Pourquoi ?',
      text: 'Une liste peut être lourde : données, filtres, cartes, détail. Le lazy loading évite de charger ce code tant que le visiteur ne vient pas sur `/users`.',
    },
    {
      title: 'Problème résolu',
      text: "La page d'accueil reste légère, et la feature Users vit dans sa propre route avec ses propres sous-routes.",
    },
    {
      title: 'Sans ça',
      text: "Angular chargerait plus de code au démarrage et le lien vers un user précis serait moins explicite qu'une URL `/users/:userId`.",
    },
  ];
  protected readonly filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.users;
    }

    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  });

  protected readonly lazyRouteSnippet = `{
  path: 'users',
  loadChildren: () =>
    import('./users/users.routes').then(
      (module) => module.USERS_ROUTES
    ),
}`;

  protected readonly nestedRouteSnippet = `export const USERS_ROUTES: Routes = [
  { path: '', component: UserListComponent },
  {
    path: ':userId',
    component: UserDetailComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      {
        path: 'info',
        component: UserInfoRouteComponent,
      },
      {
        path: 'activity',
        component: UserActivityRouteComponent,
      },
    ],
  },
];`;
  protected readonly cardLinkSnippet = `<a [routerLink]="[user.id]">...</a>`;

  protected readonly userFactorySnippet = `
  import { Service } from '@angular/core';
  import { fakerFR as faker } from '@faker-js/faker';

@Service()
export class UsersService {
  private readonly users = signal<User[]>(this.createUsers());

  getAllUsers(): User[] {
    return this.users();
  }

  private createUsers(): User[] {
    faker.seed(20260703);

    return Array.from({ length: 12 }, (_, userIndex) =>
      this.createUser({ userIndex })
    );
  }
}`;

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
