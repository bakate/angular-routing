import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-home',
  imports: [RouterLink],
  template: `
    <article class="card dashboard-card">
      <span class="badge">CanActivate</span>
      <h2>Entrée admin autorisée.</h2>
      <p class="text-secondary">
        Si tu vois cette page, \`adminCanActivateGuard\` a autorisé l'activation de
        \`/dashboard\`. Un contributor est redirigé vers \`/contributor\`, un visiteur
        anonyme vers \`/login\`.
      </p>

      <pre><code>{{ canActivateSnippet }}</code></pre>

      <div class="action-row">
        <a class="btn btn-secondary" [routerLink]="['/dashboard/users']">Tester les enfants users</a>
        <a class="btn btn-primary" [routerLink]="['/dashboard/settings']">Tester les paramètres</a>
      </div>
    </article>
  `,
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent {
  protected readonly canActivateSnippet = `export const adminCanActivateGuard: CanActivateFn = () => {
  if (inject(AuthService).isAdmin()) {
    return true;
  }

  return inject(Router).parseUrl('/login');
};`;
}
