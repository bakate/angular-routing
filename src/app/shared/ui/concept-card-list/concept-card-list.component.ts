import { Component, input } from '@angular/core';

export type ConceptCard = Readonly<{
  title: string;
  text: string;
}>;

@Component({
  selector: 'concept-card-list',
  template: `
    <div class="concept-card-list">
      @for (card of cards(); track card.title) {
        <article>
          <h3>{{ card.title }}</h3>
          <p class="text-secondary">{{ card.text }}</p>
        </article>
      }
    </div>
  `,
  styleUrls: ['./concept-card-list.component.css'],
})
export class ConceptCardListComponent {
  readonly cards = input.required<readonly ConceptCard[]>();
}
