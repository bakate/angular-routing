import { Component } from '@angular/core';

@Component({
  selector: 'user-info-route',
  template: `
    <article class="nested-panel">
      <span class="badge">/info</span>
      <h3>Informations métier</h3>
      <p class="text-secondary">
        Cette sous-route affiche les informations principales du profil. Le composant parent
        UserDetail reste monté, seule cette zone change avec l'URL.
      </p>
    </article>
  `,
  styles: [
    `
      .nested-panel {
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--primary-50);
        padding: var(--space-3);
      }

      .nested-panel h3 {
        margin: var(--space-1) 0;
      }
    `,
  ],
})
export class UserInfoRouteComponent {}
