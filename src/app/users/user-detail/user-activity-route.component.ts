import { Component } from '@angular/core';

@Component({
  selector: 'user-activity-route',
  template: `
    <article class="nested-panel">
      <span class="badge badge-success">/activity</span>
      <h3>Activité récente</h3>
      <p class="text-secondary">
        Cette sous-route pourrait afficher les actions récentes, les permissions ou les
        recommandations liées au profil. L'URL pilote la sous-vue.
      </p>
    </article>
  `,
  styles: [
    `
      .nested-panel {
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--success-50);
        padding: var(--space-3);
      }

      .nested-panel h3 {
        margin: var(--space-1) 0;
      }
    `,
  ],
})
export class UserActivityRouteComponent {}
