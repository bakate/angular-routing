import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMapNode } from '../router-lab.model';
import { RouterLabService } from '../router-lab.service';

@Component({
  selector: 'route-map',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css'],
})
export class RouteMapComponent {
  private readonly routerLabService = inject(RouterLabService);

  protected readonly routeMap = this.routerLabService.routeMap;
  protected readonly currentUrl = computed(
    () => this.routerLabService.debugSnapshot().currentUrl.split('?')[0] ?? '/'
  );

  protected isActive(node: RouteMapNode): boolean {
    if (node.path.includes(':userId')) {
      return /^\/users\/[^/]+/.test(this.currentUrl());
    }

    return this.currentUrl() === node.path;
  }

  protected canNavigate(node: RouteMapNode): boolean {
    return !node.path.includes(':userId') && node.path !== '/';
  }
}
