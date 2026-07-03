export type GuardKind =
  | 'CanActivate'
  | 'CanActivateChild'
  | 'CanDeactivate'
  | 'CanMatch';

export type GuardDecision = Readonly<{
  guardName: string;
  kind: GuardKind;
  route: string;
  currentRole: string;
  condition: string;
  result: string;
  returned: string;
  note: string;
}>;

export type ActivatedRouteNode = Readonly<{
  label: string;
  outlet: string;
  component: string;
  data: Record<string, unknown>;
  params: Record<string, string>;
  children: ActivatedRouteNode[];
}>;

export type RouterDebugSnapshot = Readonly<{
  navigationId: number;
  currentUrl: string;
  fragment: string | null;
  queryParams: Record<string, string>;
  params: Record<string, string>;
  data: Record<string, unknown>;
  routeTitle: string;
  currentComponent: string;
  activatedRouteTree: ActivatedRouteNode;
  outlets: string[];
}>;

export type InspectorContext =
  | 'users'
  | 'dashboard'
  | 'settings'
  | 'reports'
  | 'default';

export type RouteMapNode = Readonly<{
  label: string;
  path: string;
  children: RouteMapNode[];
}>;
