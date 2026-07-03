import { Component, inject, signal } from '@angular/core';
import { RouterLabService } from '../router-lab.service';

@Component({
  selector: 'guard-decision-panel',
  templateUrl: './guard-decision-panel.component.html',
  styleUrls: ['./guard-decision-panel.component.css'],
})
export class GuardDecisionPanelComponent {
  private readonly routerLabService = inject(RouterLabService);

  protected readonly guardDecision = this.routerLabService.guardDecision;
  protected readonly currentNavigationGuardDecisions =
    this.routerLabService.currentNavigationGuardDecisions;
  protected readonly guardDecisions = this.routerLabService.guardDecisions;
  protected readonly showHistory = signal(false);

  protected toggleHistory(): void {
    this.showHistory.update((isVisible) => !isVisible);
  }
}
