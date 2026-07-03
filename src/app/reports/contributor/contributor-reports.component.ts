import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';

@Component({
  selector: 'contributor-reports',
  imports: [RouterLink, CodeSnippetComponent, ConceptCardListComponent],
  templateUrl: './contributor-reports.component.html',
  styleUrls: ['../reports.component.css'],
})
export class ContributorReportsComponent {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly activeMatchIndex = signal(0);
  protected readonly whyCards: readonly ConceptCard[] = [
    {
      title: 'Pourquoi ?',
      text: "La même URL `/reports` garde un modèle simple pour l'utilisateur, même si l'implémentation change selon le rôle.",
    },
    {
      title: 'Problème résolu',
      text: "CanMatch retourne `false` pour la route admin, donc Angular continue jusqu'à trouver la route contributor.",
    },
    {
      title: 'Sans ça',
      text: "CanActivate bloquerait ou redirigerait, mais ne montrerait pas aussi clairement la sélection entre deux routes candidates.",
    },
  ];
  protected readonly matchSteps = [
    'Correspondance des routes',
    'reports (admin)',
    'CanMatch',
    'false',
    'Angular continue le matching',
    'reports (contributor)',
    'CanMatch',
    'true',
    'Composant sélectionné : ContributorReportsComponent',
  ] as const;
  protected readonly canMatchSnippet = `export const contributorReportsCanMatchGuard: CanMatchFn = () => {
  return inject(AuthService).role() === 'contributor';
};`;

  constructor() {
    this.scheduleMatchAnimation({ stepIndex: 1, delayMs: 500 });
  }

  protected isActiveTimelineStep(options: { readonly step: string }): boolean {
    if (this.activeMatchIndex() === 0) {
      return options.step === 'reports (admin)' || options.step === 'false';
    }

    return options.step === 'reports (contributor)' || options.step === 'true';
  }

  private scheduleMatchAnimation(options: {
    readonly stepIndex: number;
    readonly delayMs: number;
  }): void {
    const timeoutId = window.setTimeout(() => {
      this.activeMatchIndex.set(options.stepIndex);
    }, options.delayMs);

    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }
}
