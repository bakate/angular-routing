import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'not-found',
  imports: [RouterLink],
  styleUrls: ['./not-found.component.css'],
  template: `
    <section class="not-found animate-fade-in-up">
      <div class="not-found-code" aria-hidden="true">
        <span>4</span>
        <span class="not-found-zero">0</span>
        <span>4</span>
      </div>

      <span class="badge">Wildcard route</span>
      <h1>Angular a capturé une URL inconnue.</h1>
      <p class="text-secondary">
        Aucune route déclarée ne correspond à <code>{{ currentUrl }}</code>.
        Comme la route <code>**</code> est placée en dernier, le Router sélectionne
        ce composant 404.
      </p>

      <article class="not-found-snippet">
        <h2>Route fallback</h2>
        <pre><code>{{ wildcardSnippet }}</code></pre>
      </article>

      <div class="not-found-actions">
        <a class="btn btn-primary" [routerLink]="['/home']">Retour à l'accueil</a>
        <a class="btn btn-secondary" [routerLink]="[randomPath]">Tester une autre URL random</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected readonly currentUrl = this.router.url;
  protected readonly randomPath = `/route-inconnue-${crypto.randomUUID().slice(0, 8)}`;
  protected readonly wildcardSnippet = `export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'users', loadChildren: () => import('./users/users.routes') },
  { path: '**', component: NotFoundComponent },
];`;
}
