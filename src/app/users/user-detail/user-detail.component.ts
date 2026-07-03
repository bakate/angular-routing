import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CodeSnippetComponent } from '@shared/ui/code-snippet/code-snippet.component';
import { User } from '../user';
import { UserDetailsCardComponent } from '../user-details-card/user-details-card.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'user-detail',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CodeSnippetComponent,
    UserDetailsCardComponent,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly usersService = inject(UsersService);

  protected readonly user = signal<User | null>(null);
  protected readonly nestedRoutesSnippet = `{
  path: ':userId',
  component: UserDetailComponent,
  children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: UserInfoRouteComponent },
    { path: 'activity', component: UserActivityRouteComponent },
    { path: 'error-lab', component: UserErrorLabRouteComponent },
  ],
}`;

  ngOnInit(): void {
    this.activeRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const userId = Number(params.get('userId'));
        this.user.set(this.usersService.getUserById(userId) ?? null);
      });
  }
}
