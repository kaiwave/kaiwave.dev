window.projectData = [
  {
    id: 'jazz-frontcourt-analysis',
    featured: false,
    title: { en: 'NBA Frontcourt Pairing Analysis (Utah Jazz)', fr: 'Analyse des duos frontcourt en NBA (Utah Jazz)' },
    description: { en: 'An NBA defensive data analytics framework combining Empirical Bayes modeling with a stochastic kinematic simulation to optimize weak-side help rotations across Utah Jazz frontcourt pairings.', fr: 'Une analyse des données défensives de la NBA qui combine l\'approche bayésienne empirique avec un modèle cinématique stochastique pour optimiser les rotations des paires de joueurs du Utah Jazz.' },
    tags: ['python', 'basketball', 'research'],
    links: [
      { kind: 'primary', href: 'https://cloud.kaiwave.dev/s/ZjH9qaZKYAPYGWz', label: { en: 'Report ↗', fr: 'Document ↗' }, target: '_blank' },
      { kind: 'ghost', href: 'https://github.com/kaiwave/jazz-frontcourt-analysis', label: 'GitHub', target: '_blank' }
    ]
  },
  {
    id: 'goaltender-optimisation',
    featured: false,
    title: { en: 'Projective Analysis Goaltender Optimisation', fr: 'Analyse projective Optimisation du gardien' },
    description: { en: 'An analysis of ice hockey goaltender positioning, by modelling and optimising tradeoffs with crease aggression. Written in a Jupyter notebook with matplotlib plot rendering.', fr: 'Analyse du positionnement des gardiens; modélisation et optimisation des compromis liés à l’agressivité dans la zone. Documentation rédigée dans un notebook Jupyter avec rendu Matplotlib.' },
    tags: ['python', 'hockey', 'research'],
    links: [
      { kind: 'primary', href: 'https://cloud.kaiwave.dev/s/6jcMDzegMr3J5SM', label: { en: 'Report ↗', fr: 'Document ↗' }, target: '_blank' },
      { kind: 'ghost', href: 'https://github.com/kaiwave/projective-goalie-positioning', label: { en: 'GitHub', fr: 'GitHub' }, target: '_blank' }
    ]
  },
  {
    id: 'sleeper-nfl-players',
    featured: true,
    title: {
      en: 'Boardsteals: NFL fantasy sleeper picks',
      fr: 'Boardsteals: Choix de fantasy NFL sous-estimés'
    },
    headline: {
      en: ['Boardsteals', 'NFL fantasy sleeper picks'],
      fr: ['Boardsteals', 'Choix de fantasy NFL sous-estimés']
    },
    eyebrow: {
      en: '// py · json · data analysis',
      fr: '// py · json · analyse des données'
    },
    description: {
      en: 'NFL fantasy sleeper picks, based on underlying hidden data. Finding players with the biggest disparity between where they are and where they should be, and presenting it in a clean website. ',
      fr: 'Sélection de joueurs sous-estimés pour le fantasy football NFL, basée sur des données cachées. Identification des joueurs présentant le plus grand écart entre leur niveau actuel et leur potentiel, et présentation sur un site web clair et intuitif.'
    },
    tags: ['python', 'website', 'football', 'data'],
    links: [
      { kind: 'primary', href: 'https://boardsteals.kaiwave.dev', label: { en: 'Visit site ↗', fr: 'Visiter le site ↗' }, target: '_blank' },
      { kind: 'ghost', href: 'https://github.com/kaiwave/boardsteals-nfl', label: 'GitHub', target: '_blank' }
    ],

    codeSnippet: `<span class="cm"># Z-score mapped to 0-100 breakout scale</span> df = df[df[<span class="str">'expected_ppr'</span>] &gt;= <span class="num">6.0</span>] disp = df[<span class="str">'disparity'</span>] <span class="cm"># Normalise z </span> z = (disp - disp.<span class="fn">mean</span>()) / disp.<span class="fn">std</span>() df[<span class="str">'rating'</span>] = np.<span class="fn">clip</span>(<span class="num">55</span> + z * <span class="num">15</span>, <span class="num">0</span>, <span class="num">100</span>).<span class="fn">round</span>(<span class="num">1</span>)`,
    badgeText: 'featured'
  },
  {
    id: 'qubit-simulator-engine',
    featured: false,
    title: {
      en: 'Compiled Qubit Simulator Engine',
      fr: 'Moteur de simulation de qubits compilé'
    },
    description: {
      en: 'A Rust-compiled qubit simulator engine for python to develop intuition for working with quantum computing algorithms.',
      fr: 'Un simulateur de qubits compilé en Rust pour Python, pour de développer une intuition pour travailler avec des algorithmes de calcul quantique.'
    },
    tags: ['tool', 'quantum', 'simulation'],
    links: [
      { kind: 'disabled', href: '#', label: { en: 'In progress', fr: 'En cours' }, target: null },
    ]
  },
  {
    id: 'mcg-egress-modelling',
    featured: false,
    title: { en: 'MCG Railway Egress Modelling', fr: 'Modélisation du flux de trains (MCG)' },
    description: { en: 'Modelled railway egress dynamics from the MCG following major AFL game events for my main project in Modelling the Real World (EVSC20007), developing understanding of dynamic models. Private until end of sem.', fr: 'Modélisation de la dynamique des flux de passagers sortant du MCG après les grands matchs de l\'AFL pour mon projet principal de Modelling the Real World (EVSC20007), developpant ma compréhension des modèles dynamiques. Accès privé jusqu\'à la fin du semestre.' },
    tags: ['python', 'research', 'environment'],
    links: [
      { kind: 'disabled', href: '#', label: { en: 'In progress', fr: 'En cours' }, target: null },
    ]
  },
  {
    id: 'tp-scent-sociability',
    featured: false,
    title: {
      en: 'The TP Scent and Sociability',
      fr: 'L\'odeur du TP et la sociabilité'
    },
    description: {
      en: 'Exploring the relationship between extroversion and subjective attitudes towards the distinctive scent of a communal place. Employed some best practice methods of environmental field research.',
      fr: 'Exploration de la relation entre l\'extraversion et les attitudes subjectives envers l\'odeur caractéristique d\'un lieu public. Utilisée de méthodes de recherche environnementale de terrain conformes aux meilleures pratiques.'
    },
    tags: ['psychology', 'research', 'environment'],
    links: [
      { kind: 'primary', href: 'https://cloud.kaiwave.dev/index.php/s/SRN8P9wpR4oqaZn', label: { en: 'Report ↗', fr: 'Document ↗' }, target: '_blank' }
    ]
  },
  {
    id: 'daisy-world-rs',
    featured: false,
    title: {
      en: 'Daisy world Rust implementation',
      fr: 'Implémentation Rust de Daisy world'
    },
    description: {
      en: 'A rudimentary implementation of Lovelock and Watson\'s daisy world model. Tweakable parameters to explore the interplay with albedo, surface temperature, and life on the planet.',
      fr: 'Une implémentation rudimentaire du modèle Daisy world de Lovelock et Watson. Des paramètres ajustables permettent d\'explorer l\'interaction avec l\'albédo, la température de surface et la vie sur la planète.'
    },
    tags: ['tool', 'plotter', 'environment'],
    links: [
      { kind: 'ghost', href: 'https://github.com/kaiwave/daisy-world-rs', label: 'GitHub', target: '_blank' }
    ]
  },
];
