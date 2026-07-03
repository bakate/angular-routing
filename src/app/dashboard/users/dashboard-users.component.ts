import { Component } from '@angular/core';

@Component({
  selector: 'dashboard-users',
  template: `
    <article class="card dashboard-card">
      <span class="badge">CanActivateChild</span>
      <h2>\`/dashboard/users\` reste protégé comme route enfant.</h2>
      <p class="text-secondary">
        La règle admin est posée une seule fois au niveau du parent. Angular l'applique
        ensuite avant d'activer cette page enfant.
      </p>

      <pre><code>{{ guardSnippet }}</code></pre>
    </article>
  `,
  styleUrls: ['./dashboard-users.component.css'],
})
export class DashboardUsersComponent {
  protected readonly guardSnippet = `{
  path: '',
  component: DashboardShellComponent,
  canActivateChild: [adminChildrenGuard],
  children: [
    { path: 'users', component: DashboardUsersComponent },
  ],
}`;
}
