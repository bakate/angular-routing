import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import { UserRole } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login-page',
  imports: [RouterLink, CodeSnippetComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentRole = this.authService.role;
  protected readonly loginSnippet = `type UserRole = 'admin' | 'contributor';

login(options: { readonly role: UserRole }): void {
  this.authState.set({ role: options.role });
}`;

  protected loginWithRole(role: UserRole): void {
    this.authService.login({ role });

    if (role === 'admin') {
      void this.router.navigateByUrl('/dashboard/home');
      return;
    }

    void this.router.navigateByUrl('/contributor');
  }
}
