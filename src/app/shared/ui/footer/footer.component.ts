import { Component, inject } from '@angular/core';
import { BrandLogoComponent } from '@shared/ui/brand-logo/brand-logo.component';
import { RouterLabService } from '../../router-lab/router-lab.service';

@Component({
  selector: 'page-footer',
  imports: [BrandLogoComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  protected readonly snapshot = inject(RouterLabService).debugSnapshot;
  protected readonly guardDecision = inject(RouterLabService).guardDecision;
}
