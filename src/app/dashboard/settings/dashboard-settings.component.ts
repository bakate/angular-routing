import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';

@Component({
  selector: 'dashboard-settings',
  imports: [ReactiveFormsModule, CodeSnippetComponent, ConceptCardListComponent],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent {
  protected readonly displayNameControl = new FormControl('Démo admin', {
    nonNullable: true,
  });
  protected readonly settingsSnippet = `export const unsavedChangesGuard: CanDeactivateFn<CanLeaveDirtyPage> =
  (component) => component.canDeactivate();`;
  protected readonly canDeactivateSnippet = `canDeactivate(): boolean {
  if (!this.displayNameControl.dirty) {
    return true;
  }

  return window.confirm('Quitter sans sauvegarder les modifications ?');
}`;
  protected readonly formStateItems = [
    {
      label: 'Dirty',
      value: () => this.displayNameControl.dirty,
      summary: "L'utilisateur a modifié le champ.",
    },
    {
      label: 'Touched',
      value: () => this.displayNameControl.touched,
      summary: 'Le champ a reçu puis perdu le focus.',
    },
    {
      label: 'Pristine',
      value: () => this.displayNameControl.pristine,
      summary: "Aucune modification locale n'a été faite.",
    },
    {
      label: 'Valid',
      value: () => this.displayNameControl.valid,
      summary: 'La valeur courante passe la validation.',
    },
  ] as const;
  protected readonly canDeactivateWhyCards: readonly ConceptCard[] = [
    {
      title: 'Pourquoi ?',
      text: "Un formulaire d'administration peut contenir une modification non sauvegardée. Changer de route sans prévenir détruit ce travail.",
    },
    {
      title: 'Problème résolu',
      text: 'CanDeactivate donne au composant courant le dernier mot avant de quitter la page.',
    },
    {
      title: 'Sans ça',
      text: "Angular détruirait simplement le composant activé et l'utilisateur perdrait ses changements.",
    },
  ];

  canDeactivate(): boolean {
    if (!this.displayNameControl.dirty) {
      return true;
    }

    return window.confirm('Quitter sans sauvegarder les modifications ?');
  }

  protected save(): void {
    this.displayNameControl.markAsPristine();
  }

  protected hasUnsavedChanges(): boolean {
    return this.displayNameControl.dirty;
  }
}
