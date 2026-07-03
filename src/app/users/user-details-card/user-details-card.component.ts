import { Component, input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'user-details-card',
  templateUrl: './user-details-card.component.html',
  styleUrls: ['./user-details-card.component.css'],
})
export class UserDetailsCardComponent {
  readonly user = input.required<User>();
}
