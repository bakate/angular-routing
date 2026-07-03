import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

type ReplayStep = Readonly<{
  label: string;
  summary: string;
}>;

const REPLAY_STEPS: ReplayStep[] = [
  { label: 'URL', summary: "Angular découpe l'URL cible en segments." },
  { label: 'Matching', summary: 'Le Router cherche la première définition compatible.' },
  { label: 'Guards', summary: 'Les guards autorisent, redirigent ou laissent Angular continuer.' },
  { label: 'Outlet', summary: "Angular choisit l'endroit où rendre le composant." },
  { label: 'Composant', summary: 'Le composant de route devient visible.' },
];

@Component({
  selector: 'step-replay',
  template: `
    <article class="debug-card">
      <div class="debug-card-header">
        <button class="btn btn-primary replay-button" type="button" (click)="replayNavigation()" [disabled]="isPlaying()">
          ▶ Rejouer la navigation
        </button>
      </div>

      <ol class="replay-list">
        @for (step of replaySteps; track step.label; let stepIndex = $index) {
          <li
            [class.completed-replay-step]="stepIndex < activeStepIndex()"
            [class.active-replay-step]="stepIndex === activeStepIndex()"
          >
            <span class="step-index">{{ stepIndex + 1 }}</span>
            <div>
              <strong>{{ step.label }}</strong>
              <p class="text-secondary">{{ step.summary }}</p>
            </div>
          </li>
        }
      </ol>
    </article>
  `,
  styleUrls: ['./step-replay.component.css'],
})
export class StepReplayComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private timeoutId: number | null = null;

  protected readonly replaySteps = REPLAY_STEPS;
  protected readonly activeStepIndex = signal(-1);
  protected readonly isPlaying = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.resetReplay());
  }

  protected replayNavigation(): void {
    if (this.isPlaying()) {
      return;
    }

    this.clearScheduledStep();
    this.isPlaying.set(true);
    this.activeStepIndex.set(0);
    this.advanceStep({ nextIndex: 1 });
  }

  private advanceStep(options: { readonly nextIndex: number }): void {
    this.timeoutId = window.setTimeout(() => {
      if (options.nextIndex >= this.replaySteps.length) {
        this.isPlaying.set(false);
        this.timeoutId = null;
        return;
      }

      this.activeStepIndex.set(options.nextIndex);
      this.advanceStep({ nextIndex: options.nextIndex + 1 });
    }, 480);
  }

  private resetReplay(): void {
    this.clearScheduledStep();
    this.isPlaying.set(false);
    this.activeStepIndex.set(-1);
  }

  private clearScheduledStep(): void {
    if (this.timeoutId === null) {
      return;
    }

    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
}
