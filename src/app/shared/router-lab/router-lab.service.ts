import { Service, computed, signal } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  ActivatedRouteNode,
  GuardDecision,
  InspectorContext,
  RouteMapNode,
  RouterDebugSnapshot,
} from './router-lab.model';

const ROUTE_MAP: RouteMapNode = {
  label: '/',
  path: '/',
  children: [
    { label: 'accueil', path: '/home', children: [] },
    {
      label: 'users',
      path: '/users',
      children: [
        {
          label: ':userId',
          path: '/users/:userId',
          children: [
            { label: 'infos', path: '/users/:userId/info', children: [] },
            { label: 'activité', path: '/users/:userId/activity', children: [] },
          ],
        },
      ],
    },
    { label: 'connexion', path: '/login', children: [] },
    {
      label: 'dashboard',
      path: '/dashboard',
      children: [
        { label: 'accueil', path: '/dashboard/home', children: [] },
        { label: 'users', path: '/dashboard/users', children: [] },
        { label: 'paramètres', path: '/dashboard/settings', children: [] },
      ],
    },
    { label: 'contributor', path: '/contributor', children: [] },
    { label: 'rapports', path: '/reports', children: [] },
    { label: '**', path: '/route-inconnue-demo', children: [] },
  ],
};

@Service()
export class RouterLabService {
  private readonly navigationId = signal(0);
  readonly routeMap = signal<RouteMapNode>(ROUTE_MAP);
  readonly guardDecision = signal<GuardDecision | null>(null);
  readonly currentNavigationGuardDecisions = signal<GuardDecision[]>([]);
  readonly guardDecisions = signal<GuardDecision[]>([]);
  readonly debugSnapshot = signal<RouterDebugSnapshot>({
    navigationId: 0,
    currentUrl: '/',
    fragment: null,
    queryParams: {},
    params: {},
    data: {},
    routeTitle: 'Application',
    currentComponent: 'AppComponent',
    activatedRouteTree: {
      label: 'Application',
      outlet: 'primary',
      component: 'AppComponent',
      data: {},
      params: {},
      children: [],
    },
    outlets: ['AppComponent router-outlet'],
  });
  readonly inspectorContext = computed<InspectorContext>(() => {
    const currentUrl = this.debugSnapshot().currentUrl;

    if (currentUrl.startsWith('/users')) {
      return 'users';
    }

    if (currentUrl.startsWith('/dashboard/settings')) {
      return 'settings';
    }

    if (currentUrl.startsWith('/dashboard')) {
      return 'dashboard';
    }

    if (currentUrl.startsWith('/reports')) {
      return 'reports';
    }

    return 'default';
  });

  connect(options: {
    readonly router: Router;
    readonly activatedRoute: ActivatedRoute;
  }): void {
    this.updateDebugSnapshot({
      router: options.router,
      activatedRoute: options.activatedRoute,
    });

    options.router.events.subscribe((event) => {
      this.handleRouterEvent({ event });

      if (event instanceof NavigationEnd) {
        this.updateDebugSnapshot({
          router: options.router,
          activatedRoute: options.activatedRoute,
        });
      }
    });
  }

  recordGuardDecision(options: { readonly decision: GuardDecision }): void {
    this.guardDecision.set(options.decision);
    this.currentNavigationGuardDecisions.update((guardDecisions) => [
      ...guardDecisions,
      options.decision,
    ]);
    this.guardDecisions.update((guardDecisions) => [
      options.decision,
      ...guardDecisions,
    ].slice(0, 6));
  }

  private handleRouterEvent(options: { readonly event: Event }): void {
    if (options.event instanceof NavigationStart) {
      this.navigationId.set(options.event.id);
      this.currentNavigationGuardDecisions.set([]);
      this.guardDecision.set(null);
    }

    if (
      options.event instanceof NavigationCancel ||
      options.event instanceof NavigationError
    ) {
      this.guardDecision.set(null);
    }
  }

  private updateDebugSnapshot(options: {
    readonly router: Router;
    readonly activatedRoute: ActivatedRoute;
  }): void {
    const rootSnapshot = options.activatedRoute.snapshot;
    const deepestSnapshot = this.getDeepestSnapshot({ snapshot: rootSnapshot });

    this.debugSnapshot.set({
      navigationId: this.navigationId(),
      currentUrl: options.router.url,
      fragment: rootSnapshot.fragment,
      queryParams: this.stringifyParams({ params: rootSnapshot.queryParams }),
      params: this.mergeParams({ snapshot: rootSnapshot }),
      data: this.mergeData({ snapshot: rootSnapshot }),
      routeTitle: this.getRouteTitle({ snapshot: deepestSnapshot }),
      currentComponent: this.getComponentName({ snapshot: deepestSnapshot }),
      activatedRouteTree: this.createRouteNode({ snapshot: rootSnapshot }),
      outlets: this.collectOutlets({ snapshot: rootSnapshot }),
    });
  }

  private getDeepestSnapshot(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): ActivatedRouteSnapshot {
    const firstChild = options.snapshot.firstChild;

    if (firstChild === null) {
      return options.snapshot;
    }

    return this.getDeepestSnapshot({ snapshot: firstChild });
  }

  private createRouteNode(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): ActivatedRouteNode {
    return {
      label: this.getRouteLabel({ snapshot: options.snapshot }),
      outlet: options.snapshot.outlet,
      component: this.getComponentName({ snapshot: options.snapshot }),
      data: { ...options.snapshot.data },
      params: this.stringifyParams({ params: options.snapshot.params }),
      children: options.snapshot.children.map((childSnapshot) =>
        this.createRouteNode({ snapshot: childSnapshot })
      ),
    };
  }

  private getRouteLabel(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): string {
    const configuredPath = options.snapshot.routeConfig?.path;

    if (configuredPath === undefined || configuredPath === '') {
      return options.snapshot.parent === null ? 'Application' : '(chemin vide)';
    }

    return configuredPath;
  }

  private getRouteTitle(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): string {
    const routeTitle = options.snapshot.data['title'];

    return typeof routeTitle === 'string' ? routeTitle : 'Route sans titre';
  }

  private getComponentName(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): string {
    const component = options.snapshot.component;

    if (component === null) {
      return options.snapshot.parent === null ? 'AppComponent' : 'Route lazy';
    }

    return component.name;
  }

  private mergeParams(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): Record<string, string> {
    return options.snapshot.pathFromRoot.reduce<Record<string, string>>(
      (params, routeSnapshot) => ({
        ...params,
        ...this.stringifyParams({ params: routeSnapshot.params }),
      }),
      {}
    );
  }

  private mergeData(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): Record<string, unknown> {
    return options.snapshot.pathFromRoot.reduce<Record<string, unknown>>(
      (data, routeSnapshot) => ({
        ...data,
        ...routeSnapshot.data,
      }),
      {}
    );
  }

  private collectOutlets(options: {
    readonly snapshot: ActivatedRouteSnapshot;
  }): string[] {
    return options.snapshot.pathFromRoot
      .map((routeSnapshot) => {
        const componentName = this.getComponentName({ snapshot: routeSnapshot });
        return `${componentName} -> ${routeSnapshot.outlet}`;
      })
      .filter((outletLabel) => outletLabel !== 'AppComponent -> primary');
  }

  private stringifyParams(options: {
    readonly params: Record<string, unknown>;
  }): Record<string, string> {
    return Object.fromEntries(
      Object.entries(options.params).map(([key, value]) => [key, String(value)])
    );
  }
}
