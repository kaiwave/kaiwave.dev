window.projectData = [
  {
    id: 'goalkeeper-optimisation',
    featured: true,
    title: {
      en: 'Projective Analysis Goaltender Optimisation',
      fr: 'Analyse projective Optimisation du gardien'
    },
    headline: {
      en: ['Projective Analysis', 'Goaltender Optimisation'],
      fr: ['Analyse projective', 'Optimisation du gardien']
    },
    eyebrow: {
      en: '// ipynb · projective geometry',
      fr: '// ipynb · géométrie projective'
    },
    description: {
      en: 'An analysis of ice hockey goaltender positioning, by modelling and optimising tradeoffs with crease aggression. Written in a Jupyter notebook with matplotlib plot rendering.',
      fr: 'Analyse du positionnement des gardiens; modélisation et optimisation des compromis liés à l’agressivité dans la zone. Documentation rédigée dans un notebook Jupyter avec rendu Matplotlib.'
    },
    tags: ['python','visualisation', 'sport', 'research'],
    links: [
      { kind: 'disabled', href: '#', label: { en: 'In progress', fr: 'En cours' }, target: null },
      { kind: 'ghost', href: 'https://github.com/kaiwave/goaltender-optimisation-jnb', label: 'GitHub', target: '_blank' }
    ],
    codeSnippet: `<span class="cm"># Monte Carlo static depth solver</span>
<span class="kw">def</span> <span class="fn">obj</span>(d_g):
    <span class="kw">return</span> np.<span class="fn">mean</span>([
        <span class="fn">exposed_area_eff</span>(x_p, y_p, d_g, theta_set)[<span class="num">0</span>]
        <span class="kw">for</span> x_p, y_p <span class="kw">in</span> samples
    ])

<span class="cm"># 1D bounded optimization over crease depth</span>
res = <span class="fn">minimize_scalar</span>(obj, bounds=(<span class="num">0.0</span>, R_CREASE), method=<span class="str">'bounded'</span>)
d_g_star = <span class="fn">float</span>(res.x)`,
    badgeText: 'featured'
  },
  {
    id: 'sleeper-nfl-players',
    featured: false,
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
    tags: ['python', 'website', 'sport', 'data'],
    links: [
      { kind: 'disabled', href: '#', label: { en: 'In progress', fr: 'En cours' }, target: null },
      { kind: 'ghost', href: 'https://github.com/kaiwave/boardsteals-nfl', label: 'GitHub', target: '_blank' }
    ],

    codeSnippet: `<span class="cm"># Z-score mapped to 0-100 breakout scale</span> df = df[df[<span class="str">'expected_ppr'</span>] &gt;= <span class="num">6.0</span>] disp = df[<span class="str">'disparity'</span>] <span class="cm"># Normalise z </span> z = (disp - disp.<span class="fn">mean</span>()) / disp.<span class="fn">std</span>() df[<span class="str">'rating'</span>] = np.<span class="fn">clip</span>(<span class="num">55</span> + z * <span class="num">15</span>, <span class="num">0</span>, <span class="num">100</span>).<span class="fn">round</span>(<span class="num">1</span>)`,
    badgeText: 'featured'
  },
  {
    id: 'mcg-egress-modelling',
    featured: false,
    title: {
      en: 'MCG Railway Egress Modelling',
      fr: 'Modélisation du flux de trains (MCG)'
    },
    description: {
      en: 'Modelled railway egress dynamics from the MCG following major AFL game events for my main project in Modelling the Real World (EVSC20007), developing understanding of dynamic models. Private until end of sem.',
      fr: 'Modélisation de la dynamique des flux de passagers sortant du MCG après les grands matchs de l\'AFL pour mon projet principal de Modelling the Real World (EVSC20007), developpant ma compréhension des modèles dynamiques. Accès privé jusqu\'à la fin de la semaine.'
    },
    tags: ['python', 'research', 'sport', 'visualisation'],
    links: [
      { kind: 'disabled', href: '#', label: { en: 'In progress', fr: 'En cours' }, target: null },
      { kind: 'ghost', href: 'https://github.com/kaiwave/mcg-railway-egress-jnb', label: 'GitHub', target: '_blank' }
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
    tags: ['rust', 'plotter', 'climate science'],
    links: [
      { kind: 'ghost', href: 'https://github.com/kaiwave/daisy-world-rs', label: 'GitHub', target: '_blank' }
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
];
