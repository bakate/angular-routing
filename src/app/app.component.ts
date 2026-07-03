import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { GuardDecisionPanelComponent } from '@shared/router-lab/guard-decision-panel/guard-decision-panel.component';
import { RouteMapComponent } from '@shared/router-lab/route-map/route-map.component';
import { RouterDebuggerComponent } from '@shared/router-lab/router-debugger/router-debugger.component';
import { RouterLabService } from '@shared/router-lab/router-lab.service';
import { StepReplayComponent } from '@shared/router-lab/step-replay/step-replay.component';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';

@Component({
  selector: 'app',
  imports: [
    FooterComponent,
    GuardDecisionPanelComponent,
    NavbarComponent,
    RouteMapComponent,
    RouterDebuggerComponent,
    RouterOutlet,
    StepReplayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly routerLabService = inject(RouterLabService);
  protected readonly inspectorOpen = signal(false);
  protected readonly inspectorContext = this.routerLabService.inspectorContext;
  protected readonly showDebugger = computed(() =>
    ['users', 'default'].includes(this.inspectorContext())
  );
  protected readonly showRouteMap = computed(() =>
    ['users', 'default'].includes(this.inspectorContext())
  );
  protected readonly showGuards = computed(() =>
    ['dashboard', 'settings', 'reports'].includes(this.inspectorContext())
  );
  protected readonly showReplay = computed(() => this.inspectorContext() !== 'settings');
  protected readonly showSnapshot = computed(() =>
    ['users', 'dashboard', 'settings', 'reports', 'default'].includes(
      this.inspectorContext()
    )
  );

  constructor() {
    this.routerLabService.connect({
      router: this.router,
      activatedRoute: inject(ActivatedRoute),
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.inspectorOpen.set(false));
  }

  protected toggleInspector(): void {
    this.inspectorOpen.update((isOpen) => !isOpen);
  }
}
