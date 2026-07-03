import { Service, signal } from '@angular/core';

const DEFAULT_DISPLAY_NAME = 'Démo admin';

@Service()
export class DashboardSettingsService {
  private readonly savedDisplayName = signal(DEFAULT_DISPLAY_NAME);

  readonly displayName = this.savedDisplayName.asReadonly();

  saveDisplayName(options: { readonly displayName: string }): void {
    this.savedDisplayName.set(options.displayName);
  }
}
