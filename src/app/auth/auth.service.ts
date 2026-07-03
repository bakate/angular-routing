import { Service, computed, signal } from '@angular/core';
import { AuthState, UserRole } from './auth.model';

const AUTH_STORAGE_KEY = 'angular-routing-demo-auth';

@Service()
export class AuthService {
  private readonly authState = signal<AuthState>(this.readStoredAuthState());
  readonly role = computed(() => this.authState().role);
  readonly isAuthenticated = computed(() => this.role() !== null);
  readonly isAdmin = computed(() => this.role() === 'admin');
  readonly isContributor = computed(() => this.role() === 'contributor');

  login(options: { readonly role: UserRole }): void {
    const authState = { role: options.role } as const;
    this.authState.set(authState);
    this.storeAuthState({ authState });
  }

  logout(): void {
    const authState = { role: null } as const;
    this.authState.set(authState);
    this.storeAuthState({ authState });
  }

  private readStoredAuthState(): AuthState {
    const storedRole = globalThis.localStorage?.getItem(AUTH_STORAGE_KEY);

    if (storedRole === 'admin' || storedRole === 'contributor') {
      return { role: storedRole };
    }

    return { role: null };
  }

  private storeAuthState(options: { readonly authState: AuthState }): void {
    if (options.authState.role === null) {
      globalThis.localStorage?.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    globalThis.localStorage?.setItem(AUTH_STORAGE_KEY, options.authState.role);
  }
}
