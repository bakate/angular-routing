import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  CanDeactivateFn,
  CanMatchFn,
  Router,
  UrlTree,
} from '@angular/router';
import { UserRole } from './auth.model';
import { AuthService } from './auth.service';
import { RouterLabService } from '@shared/router-lab/router-lab.service';

export type CanLeaveDirtyPage = Readonly<{
  canDeactivate: () => boolean;
}>;

const redirectAdminAway = (): UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isContributor()) {
    return router.parseUrl('/contributor?guard=canActivate&from=dashboard');
  }

  return router.parseUrl('/login');
};

const canAccessAdminArea = (): boolean | UrlTree => {
  const authService = inject(AuthService);

  if (authService.isAdmin()) {
    return true;
  }

  return redirectAdminAway();
};

const canMatchRole = (role: UserRole): boolean => {
  const authService = inject(AuthService);

  return authService.role() === role;
};

const recordGuardDecision = (options: {
  readonly guardName: string;
  readonly kind: 'CanActivate' | 'CanActivateChild' | 'CanDeactivate' | 'CanMatch';
  readonly route: string;
  readonly condition: string;
  readonly result: boolean;
  readonly returned: string;
  readonly note: string;
}): void => {
  const authService = inject(AuthService);
  inject(RouterLabService).recordGuardDecision({
    decision: {
      guardName: options.guardName,
      kind: options.kind,
      route: options.route,
      currentRole: authService.role() ?? 'anonyme',
      condition: options.condition,
      result: String(options.result),
      returned: options.returned,
      note: options.note,
    },
  });
};

// CanActivate protects the admin feature entry point before Angular activates it.
export const adminCanActivateGuard: CanActivateFn = () => {
  const result = canAccessAdminArea();
  const allowed = result === true;

  recordGuardDecision({
    guardName: 'adminCanActivateGuard',
    kind: 'CanActivate',
    route: '/dashboard',
    condition: 'role === "admin"',
    result: allowed,
    returned: allowed ? 'true' : 'UrlTree("/contributor" ou "/login")',
    note: "CanActivate s'exécute avant l'activation de la feature admin.",
  });

  return result;
};

// CanActivateChild centralizes access control for every child route under /dashboard.
export const adminChildrenGuard: CanActivateChildFn = (_childRoute, state) => {
  const result = canAccessAdminArea();
  const allowed = result === true;

  recordGuardDecision({
    guardName: 'adminChildrenGuard',
    kind: 'CanActivateChild',
    route: state.url,
    condition: 'role === "admin"',
    result: allowed,
    returned: allowed ? 'true' : 'UrlTree("/contributor" ou "/login")',
    note: 'CanActivateChild protège chaque route enfant sous /dashboard.',
  });

  return result;
};

// CanDeactivate lets the component decide whether leaving would lose local edits.
export const unsavedChangesGuard: CanDeactivateFn<CanLeaveDirtyPage> = (
  component,
  _currentRoute,
  _currentState,
  nextState
) => {
  const result = component.canDeactivate();

  recordGuardDecision({
    guardName: 'unsavedChangesGuard',
    kind: 'CanDeactivate',
    route: nextState?.url ?? 'route suivante',
    condition: 'component.canDeactivate()',
    result,
    returned: String(result),
    note: 'CanDeactivate demande au composant courant si la sortie est autorisée.',
  });

  return result;
};

// CanMatch selects the admin implementation of /reports only for admin users.
export const adminReportsCanMatchGuard: CanMatchFn = () => {
  const result = canMatchRole('admin');

  recordGuardDecision({
    guardName: 'adminReportsCanMatchGuard',
    kind: 'CanMatch',
    route: '/reports (définition admin)',
    condition: 'role === "admin"',
    result,
    returned: String(result),
    note: result
      ? 'Angular sélectionne la route des rapports admin.'
      : 'Angular ignore cette définition de route et continue le matching.',
  });

  return result;
};

// CanMatch returns false for contributors so Angular can try the next /reports route.
export const contributorReportsCanMatchGuard: CanMatchFn = () => {
  const result = canMatchRole('contributor');

  recordGuardDecision({
    guardName: 'contributorReportsCanMatchGuard',
    kind: 'CanMatch',
    route: '/reports (définition contributor)',
    condition: 'role === "contributor"',
    result,
    returned: String(result),
    note: result
      ? 'Angular sélectionne la route des rapports contributor.'
      : 'Angular ignore cette définition de route et essaie la route de fallback.',
  });

  return result;
};
