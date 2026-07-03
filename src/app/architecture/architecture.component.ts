import { Component } from '@angular/core';

interface RouterNote {
  readonly title: string;
  readonly why: string;
  readonly impact: string;
}

@Component({
  selector: 'architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css'],
})
export class ArchitectureComponent {
  protected readonly demoGoals = [
    'lazy standalone routes',
    'nested routes',
    'route params',
    'CanActivate',
    'CanActivateChild',
    'CanMatch',
    'CanDeactivate',
    'UrlTree',
    'RouterOutlet',
    'ActivatedRoute',
  ] as const;

  protected readonly routerNotes: RouterNote[] = [
    {
      title: 'Pourquoi CanMatch est souvent préférable',
      why: 'Angular exécute CanMatch pendant la sélection de route, avant de choisir le composant à afficher.',
      impact:
        'La route non pertinente est ignorée et Angular peut continuer vers une autre définition du même path.',
    },
    {
      title: 'Pourquoi UrlTree est plus propre',
      why: 'Un guard doit retourner une décision au Router, pas déclencher une navigation cachée.',
      impact:
        'La navigation reste déterministe, lisible dans les tests, et observable dans le pipeline du Router.',
    },
    {
      title: "Pourquoi les nested routes rendent l'UI plus simple",
      why: 'La page parent garde le contexte principal pendant que la sous-vue change dans son RouterOutlet.',
      impact:
        "L'interface évite de tout remonter à chaque clic et rend la hiérarchie d'URL plus évidente.",
    },
    {
      title: "Pourquoi CanDeactivate a besoin d'un vrai état",
      why: 'Le guard doit interroger une donnée métier claire : ici, la valeur courante diffère de la valeur sauvegardée.',
      impact:
        "L'utilisateur comprend pourquoi Angular bloque ou laisse sortir, au lieu de subir une confirmation magique.",
    },
  ];
}
