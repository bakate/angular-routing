import { Component, signal } from '@angular/core';

@Component({
  selector: 'user-error-lab-route',
  template: `
    <article class="nested-panel">
      <span class="badge badge-warning">/error-lab</span>
      <h3>Erreur capturée localement</h3>
      <p class="text-secondary">
        Angular n'a pas d'Error Boundary natif comme React. Ici, on provoque une erreur
        dans une sous-route, puis on la capture au point d'appel avec <code>try/catch</code>
        pour éviter qu'elle remonte jusqu'à l'ErrorHandler global.
      </p>

      <button class="btn btn-primary" type="button" (click)="runRiskyOperation()">
        Déclencher l'erreur locale
      </button>

      @if (capturedError(); as errorMessage) {
        <div class="local-error">
          <strong>Erreur capturée</strong>
          <code>{{ errorMessage }}</code>
          <p class="text-secondary">
            Le parent <code>UserDetailComponent</code> reste monté, et seule cette sous-vue
            affiche un fallback.
          </p>
        </div>
      }

      <pre><code>{{ localErrorSnippet }}</code></pre>
    </article>
  `,
  styles: [
    `
      .nested-panel {
        display: grid;
        gap: var(--space-2);
        border: 1px solid var(--warning-500);
        border-radius: var(--radius-md);
        background: var(--warning-50);
        padding: var(--space-3);
      }

      .nested-panel h3 {
        margin: var(--space-1) 0 0;
      }

      .nested-panel p {
        max-width: 640px;
      }

      .local-error {
        display: grid;
        gap: 0.45rem;
        border: 1px solid var(--error-500);
        border-radius: var(--radius-md);
        background: var(--error-50);
        padding: var(--space-2);
      }

      .local-error strong {
        color: var(--error-700);
      }
    `,
  ],
})
export class UserErrorLabRouteComponent {
  protected readonly capturedError = signal<string | null>(null);
  protected readonly localErrorSnippet = `runRiskyOperation(): void {
  try {
    this.throwNestedRouteError();
  } catch (error: unknown) {
    this.capturedError.set(error instanceof Error ? error.message : 'Unknown error');
  }
}`;

  protected runRiskyOperation(): void {
    try {
      this.throwNestedRouteError();
    } catch (error: unknown) {
      this.capturedError.set(
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  }

  private throwNestedRouteError(): never {
    throw new Error('Erreur volontaire dans /users/:userId/error-lab');
  }
}
