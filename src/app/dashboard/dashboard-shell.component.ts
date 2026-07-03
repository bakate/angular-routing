import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@/auth/auth.service';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';

@Component({
  selector: 'dashboard-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CodeSnippetComponent,
    ConceptCardListComponent,
  ],
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.css'],
})
export class DashboardShellComponent {
  protected readonly role = inject(AuthService).role;
  protected readonly guardWhyCards: readonly ConceptCard[] = [
    {
      title: 'Pourquoi ?',
      text: "Un espace admin ne doit jamais dépendre d'un simple bouton caché. L'URL `/dashboard` doit être protégée directement.",
    },
    {
      title: 'Problème résolu',
      text: 'CanActivate bloque l’entrée de la feature, puis CanActivateChild centralise la règle pour toutes les pages internes.',
    },
    {
      title: 'Sans ça',
      text: "Un contributor pourrait tenter l'URL à la main, ou il faudrait répéter le même guard sur chaque route enfant.",
    },
  ];
  protected readonly childGuardSnippet = `{
  path: '',
  component: DashboardShellComponent,
  canActivateChild: [adminChildrenGuard],
  children: [
    { path: 'home', component: DashboardHomeComponent },
    { path: 'users', component: DashboardUsersComponent },
    {
      path: 'settings',
      component: DashboardSettingsComponent,
      canDeactivate: [unsavedChangesGuard],
    },
  ],
}`;
}
