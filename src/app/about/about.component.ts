import { Component } from '@angular/core';

interface RouterNote {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  protected readonly routerNotes: RouterNote[] = [
    {
      title: 'canMatch est le guard à comprendre',
      description:
        "Il décide si une définition de route peut être sélectionnée. Pour les features lazy-loadées, c'est plus clair que de bloquer seulement après le match.",
    },
    {
      title: 'Retourner un UrlTree, pas naviguer impérativement',
      description:
        'Un guard doit retourner une décision de routing. Appeler navigateByUrl dans le guard cache la décision et rend les tests moins solides.',
    },
    {
      title: 'Les outlets imbriqués rendent le contexte visible',
      description:
        "La page détail reste montée pendant que la sous-vue change. C'est une manière concrète d'expliquer les routes enfants.",
    },
    {
      title: 'canDeactivate a besoin d’un vrai état dirty',
      description:
        "La démo utilise une modification de formulaire comme déclencheur, parce qu'un guard sans conséquence visible reste trop abstrait.",
    },
  ];
}
