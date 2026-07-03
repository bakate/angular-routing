import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';

@Component({
  selector: 'admin-reports',
  imports: [RouterLink, CodeSnippetComponent, ConceptCardListComponent],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['../reports.component.css'],
})
export class AdminReportsComponent {
  protected readonly whyCards: readonly ConceptCard[] = [
    {
      title: 'Pourquoi ?',
      text: "Deux rôles peuvent partager la même URL métier `/reports`, mais ne doivent pas voir le même écran.",
    },
    {
      title: 'Problème résolu',
      text: 'CanMatch permet à Angular de choisir la bonne définition de route avant de charger le composant.',
    },
    {
      title: 'Sans ça',
      text: "Il faudrait créer deux URLs artificielles ou charger un composant unique rempli de conditions de rôle.",
    },
  ];
  protected readonly matchSteps = [
    'Correspondance des routes',
    'reports (admin)',
    'CanMatch',
    'true',
    'Composant sélectionné : AdminReportsComponent',
  ] as const;
  protected readonly canMatchSnippet = `{
  path: 'reports',
  canMatch: [adminReportsCanMatchGuard],
  loadComponent: () => import('./reports/admin/admin-reports.component'),
},
{
  path: 'reports',
  canMatch: [contributorReportsCanMatchGuard],
  loadComponent: () => import('./reports/contributor/contributor-reports.component'),
}`;
}
