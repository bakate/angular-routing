import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@/auth/auth.service';

@Component({
  selector: 'contributor-page',
  imports: [RouterLink],
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.css'],
})
export class ContributorComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly queryParamMap = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: this.activatedRoute.snapshot.queryParamMap,
  });

  protected readonly role = this.authService.role;
  protected readonly canActivateSnippet = `export const adminCanActivateGuard: CanActivateFn = () => {
  if (inject(AuthService).isAdmin()) {
    return true;
  }

  return inject(Router).parseUrl('/contributor?guard=canActivate');
};`;
  protected readonly showCanActivateModal = computed(
    () => this.queryParamMap().get('guard') === 'canActivate'
  );

  protected closeGuardModal(): void {
    void this.router.navigate(['/contributor'], {
      replaceUrl: true,
    });
  }

  protected switchToAdmin(): void {
    this.authService.login({ role: 'admin' });
    void this.router.navigateByUrl('/dashboard/home');
  }
}
