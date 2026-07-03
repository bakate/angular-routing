import { Component, input } from '@angular/core';

type BrandLogoTone = 'light' | 'dark';

@Component({
  selector: 'brand-logo',
  template: `
    <span class="brand-logo" [class.brand-logo-dark]="tone() === 'dark'">
      <span class="brand-logo-mark" aria-hidden="true">A</span>
      <span class="brand-logo-text">Angular Router Explorer</span>
    </span>
  `,
  styleUrls: ['./brand-logo.component.css'],
})
export class BrandLogoComponent {
  readonly tone = input<BrandLogoTone>('light');
}
