import { Component, input } from '@angular/core';

@Component({
  selector: 'code-snippet',
  template: `
    <article class="snippet-card">
      <h2>{{ title() }}</h2>
      <pre><code>{{ code() }}</code></pre>
    </article>
  `,
  styleUrls: ['./code-snippet.component.css'],
})
export class CodeSnippetComponent {
  readonly title = input.required<string>();
  readonly code = input.required<string>();
}
