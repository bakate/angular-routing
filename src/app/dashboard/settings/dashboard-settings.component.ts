import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import {
  ConceptCard,
  ConceptCardListComponent,
} from '@shared/ui/concept-card-list/concept-card-list.component';
import { DashboardSettingsService } from './dashboard-settings.service';

type DashboardSettingsFormModel = Readonly<{
  displayName: string;
}>;

@Component({
  selector: 'dashboard-settings',
  imports: [FormField, CodeSnippetComponent, ConceptCardListComponent],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent {
  private readonly dashboardSettingsService = inject(DashboardSettingsService);

  protected readonly savedDisplayName = this.dashboardSettingsService.displayName;
  protected readonly settingsModel = signal<DashboardSettingsFormModel>({
    displayName: this.savedDisplayName(),
  });
  protected readonly settingsForm = form(this.settingsModel);
  protected readonly displayNameField = this.settingsForm.displayName;
  protected readonly currentDisplayName = computed(() =>
    this.displayNameField().value()
  );
  protected readonly hasUnsavedChanges = computed(
    () => this.currentDisplayName() !== this.savedDisplayName()
  );
  protected readonly settingsSnippet = `{
  path: '',
  component: DashboardShellComponent,
  providers: [DashboardSettingsService],
  children: [
    {
      path: 'settings',
      canDeactivate: [unsavedChangesGuard],
    },
  ],
}`;
  protected readonly canDeactivateSnippet = `canDeactivate(): boolean {
  if (!this.hasUnsavedChanges()) {
    return true;
  }

  return window.confirm(
    'Quitter sans sauvegarder ?\\nOK = quitter, Annuler = rester.'
  );
}`;
  protected readonly formStateItems = [
    {
      label: 'Dirty',
      value: () => this.hasUnsavedChanges(),
      summary: "L'utilisateur a modifié le champ.",
    },
    {
      label: 'Touched',
      value: () => this.displayNameField().touched(),
      summary: 'Le champ a reçu puis perdu le focus.',
    },
    {
      label: 'Pristine',
      value: () => !this.hasUnsavedChanges(),
      summary: 'La valeur courante correspond à la valeur sauvegardée.',
    },
    {
      label: 'Valid',
      value: () => this.displayNameField().valid(),
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
    if (!this.hasUnsavedChanges()) {
      return true;
    }

    return window.confirm(
      'Quitter sans sauvegarder ?\nOK = quitter, Annuler = rester.'
    );
  }

  protected save(): void {
    this.dashboardSettingsService.saveDisplayName({
      displayName: this.currentDisplayName(),
    });
    this.displayNameField().reset(this.currentDisplayName());
  }
}
