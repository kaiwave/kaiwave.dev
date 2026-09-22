/* ============================================================
   PORTFOLIO — main.js
   ============================================================
   Lightweight vanilla JS — no frameworks needed.
   Each section is clearly labelled so you can find and
   tweak the bit you want.
   ============================================================ */

/* ── Active nav link ─────────────────────────────────────── */
(function markActiveLink() {
  const links = document.querySelectorAll('.nav__links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) link.classList.add('active');
  });
})();

/* ── Language toggle ─────────────────────────────────────── */
const translations = {
  en: {
    home: 'home', projects: 'projects', notes: 'posts', about: 'about', contact: 'contact',
    herodesc: 'Mathematical Physics undergraduate at the University of Melbourne. I build models, and love everything mathematical physics and scientific computing. ',
    heroeyebrow: '// physics · math · models',
    seework: 'See my work',
    surmoi: 'About me',
    heroGreeting: "hi, i'm",
    researchrep: "research reports",
    ongoingrep: "ongoing projects",
    magicjoke: "magics consumed",
    featuredProject: 'featured project',
    featuredProjectSub: "the thing i'm most excited about right now.",
    recentNotes: 'recent posts',
    recentNotesSub: "thoughts and write-ups i've been working on.",

    allNotes: 'All notes →', builtWith: 'built with html + css + love', all: 'all',
    aboutTag: '// the kai behind the wave',
    aboutintro: 'hey, I’m Malakai',
    aboutintro1: 'I’m an undergrad studying mathematical physics at the University of Melbourne. My interests sit at the intersection of theoretical physics, scientific computing, and quantitative financial and sport analytics applications. ',
    interestTitle: 'research interests',
    interestList: 'Quantum Mechanics · High Frequency Trading · Machine learning · Computational Mathematics · Statistical Physics',
    skills: 'tools & skills',
    education: 'education',
    current: 'current',
    featuredInProgress: 'In progress',
    report: 'Report ↗',

    projectsTag: "// what i've been building",
    notesTag: '// thoughts, publications & write-ups',
    notesdesc: 'Some write-ups, thoughts, and lessons that I’ve learned throughout my life. Inspired constantly by the world and people around me. ',
    searchNotes: 'search notes…',

    contactTag: "// let's talk",
    contactDesc: 'Collaborations, questions, feedback, or just saying hi... anything is welcome!',
    howToContact: 'how to reach me',
    procraJoke: 'Response time is usually a day or two. Faster if you catch me during procrastination hours (ask me when those are).',

    // things that probably change
    featuredEyebrow: "// ipynb · projective geometry",
    featuredTitleLine1: 'Projective Analysis',
    featuredTitleLine2: 'Goaltender Optimisation',
    featuredDescription: 'An analysis of ice hockey goaltender positioning; modelling and optimising tradeoffs with crease aggression. Written in a Jupyter notebook with matplotlib rendering.',

    aboutintro2: 'I’ve just finished building Boardsteals, an NFL fantasy pipeline which tracks underrated players using underlying data. Now, I’m working on using projective geometry and stochastic methods to model goaltender positioning optimisations in ice hockey based on common shot positions. On that note, I enjoy playing hockey, playing bass, the occasional league of legends, and convincing myself that I’m better than everyone for drinking oat magics. ',
  },
  
  fr: {
    home: 'accueil', projects: 'projets', notes: 'posts', about: 'a propos', contact: 'contact',
    herodesc: 'Étudiant en physique mathématique à University of Melbourne. Je construis des modèles et je suis passionnée par la physique mathématique et le calcul scientifique.',
    heroeyebrow: '// physique · mathématiques · modèles',
    seework: 'Voir mes travails', 
    surmoi: 'A propos de moi',
    heroGreeting: 'bonjour, je suis',
    researchrep: "rapports de recherche",
    ongoingrep: "projets en cours",
    magicjoke: "cafés consommés",
    featuredProject: 'projet a la une',
    featuredProjectSub: 'ce qui me passionne le plus en ce moment.',
    recentNotes: 'posts recentes',
    recentNotesSub: 'idees et textes sur lesquels je travaille.',

    allNotes: 'Toutes les notes →', builtWith: 'cree avec html + css + l’amour', all: 'tous',
    aboutTag: '// l’homme derriere les carnets',
    aboutintro: 'salut, je suis Malakai',
    aboutintro1: 'Je suis étudiant de premier cycle en physique mathématique à University of Melbourne. Mes intérêts se situent à l’intersection de la physique théorique, du calcul scientifique et des applications financières et sportifs quantitatives.',
    interestTitle: 'intérêts de recherche',
    interestList: 'Mécanique quantique · Trading haute fréquence · Machine Learning · Mathématiques computationnelles · Physique statistique',
    skills: 'programmes & compétences',
    education: 'éducation',
    current: 'en cours',
    featuredInProgress: 'En cours',
    report: 'Document ↗',

    projectsTag: '// ce que je construis',
    notesTag: '// réflexions, publications et articles',
    notesdesc: 'Quelques écrits, réflexions et leçons tirées de ma vie. Constamment inspirée par le monde et les gens dans ma vie. (Disponible principalement en anglais)',
    searchNotes: 'rechercher des notes…',
    projectSub: "Recherches, simulations, modèles, explorations de données et programmes que j'ai publiés ou sur lesquels je travaille. La plupart sont disponibles sur GitHub ou sur mon cloud.",

    contactTag: '// parlons-en',
    contactDesc: 'Collaborations, questions, commentaires, ou simplement pour dire bonjour... tout est le bienvenu!',
    howToContact: 'comment me joindre',
    procraJoke: 'Je réponds généralement sous un jour ou deux. Plus vite si vous me contactez pendant que je sèche les cours (demandez-moi quand).',

    // things that probably change
    featuredEyebrow: "// ipynb · géométrie projective",
    featuredTitleLine1: 'Analyse projective',
    featuredTitleLine2: 'Optimisation du gardien',
    featuredDescription: 'Analyse du positionnement des gardiens; modélisation et optimisation des compromis liés à l’agressivité dans la zone. Documentation rédigée dans un notebook Jupyter avec rendu Matplotlib.',

    aboutintro2: 'Je viens de terminer la création de Boardsteals, un outil de fantasy football NFL qui utilise des données sous-jacentes. Présentement, je travaille sur la modélisation de l’optimisation du positionnement des gardiens à l’aide de la géométrie projective et des méthodes stochastiques, en fonction des positions de tir les plus fréquentes. À ce propos, j’aime jouer au hockey, à la basse, et me persuader que je suis meilleur que tout le monde parce que je préfère le pneu sur la glace à la crème glacée.',
  }
};

const siteState = {
  currentLanguage: localStorage.getItem('site-language') || 'en',
  projectsExpanded: false,
  activeProjectFilter: 'all',
};

function getLocalizedValue(value, language) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[language] || value.en || Object.values(value)[0] || '';
  }
  return '';
}

function renderFeaturedProject() {
  const root = document.getElementById('featured-project-root');
  if (!root || !window.projectData?.length) return;

  const featuredProject = window.projectData.find(project => project.featured) || window.projectData[0];
  if (!featuredProject) return;

  const language = siteState.currentLanguage;
  const headlineEntries = featuredProject.headline && typeof featuredProject.headline === 'object'
    ? featuredProject.headline[language] || featuredProject.headline.en || []
    : Array.isArray(featuredProject.headline)
      ? featuredProject.headline
      : [getLocalizedValue(featuredProject.title, language)];

  const titleLines = Array.isArray(headlineEntries) && headlineEntries.length
    ? headlineEntries.map(line => getLocalizedValue(line, language))
    : [getLocalizedValue(featuredProject.title, language)];

  const tagMarkup = (featuredProject.tags || []).map(tag => {
    const palette = ['tag--sage', 'tag--lavender', 'tag--brown', 'tag--moss'];
    const paletteIndex = Math.abs(tag.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length;
    return `<span class="tag ${palette[paletteIndex]}">${tag}</span>`;
  }).join('');

  const linkMarkup = (featuredProject.links || []).map(link => {
    const href = link.href || '#';
    const label = getLocalizedValue(link.label, language);
    const isDisabled = link.kind === 'disabled';
    const classes = isDisabled ? 'btn btn--disabled' : `btn btn--${link.kind || 'ghost'}`;
    const attrs = link.target ? ` target="${link.target}" rel="noopener noreferrer"` : '';
    const disabledAttrs = isDisabled ? ' aria-disabled="true" tabindex="-1"' : '';
    return `<a href="${href}" class="${classes}"${attrs}${disabledAttrs}>${label}</a>`;
  }).join('');

  const codeMarkup = featuredProject.codeSnippet
    ? `<div class="code-preview">${featuredProject.codeSnippet}</div>`
    : '';

  root.innerHTML = `
    <div class="featured-project">
      <div>
        <p class="featured-project__badge">${getLocalizedValue(featuredProject.eyebrow, language)}</p>
        <h3 class="featured-project__title">${titleLines.map((line, index) => index === titleLines.length - 1 ? `<span>${line}</span>` : `<span>${line}</span><br>`).join('')}</h3>
        <p class="featured-project__desc">${getLocalizedValue(featuredProject.description, language)}</p>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">${tagMarkup}</div>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">${linkMarkup}</div>
      </div>
      ${codeMarkup}
    </div>
  `;
}

function getFilteredProjects(filterName = 'all') {
  const activeFilter = (filterName || 'all').toLowerCase();

  return [...(window.projectData || [])].filter(project => {
    if (activeFilter === 'all') return true;
    const tags = (project.tags || []).map(tag => tag.trim().toLowerCase());
    return tags.includes(activeFilter);
  }).sort((first, second) => {
    if (first.featured !== second.featured) return Number(second.featured) - Number(first.featured);
    return 0;
  });
}

function getNoteTagMarkup(tags = []) {
  const palette = ['tag--lavender', 'tag--sage', 'tag--brown', 'tag--moss'];
  return (tags || []).map((tag, index) => {
    const paletteIndex = Math.abs(tag.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length;
    return `<span class="tag ${palette[(index + paletteIndex) % palette.length]}">${tag}</span>`;
  }).join('');
}

function renderNoteCard(note) {
  const title = note.featured ? `<span class="badge-crown">★ Featured</span> ${note.title}` : note.title;
  const tagMarkup = getNoteTagMarkup(note.tags || []);
  return `
    <a href="${note.href}" class="note-row" data-search="${note.search || ''}" data-note-id="${note.id}">
      <div>
        <div class="note-row__title">${title}</div>
        <div class="note-row__tags">${tagMarkup}</div>
      </div>
      <div class="note-row__date">${note.date}</div>
    </a>
  `;
}

function groupNotesByYear(notes) {
  return Object.entries(
    notes.reduce((groups, note) => {
      const year = new Date(note.date).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(note);
      return groups;
    }, {})
  ).sort((a, b) => Number(b[0]) - Number(a[0]));
}

function renderNotesList() {
  const notesList = document.getElementById('notes-list');
  if (!notesList || !window.noteData?.length) return;

  const notes = [...window.noteData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const groupedNotes = groupNotesByYear(notes);

  notesList.innerHTML = groupedNotes.map(([year, notesInYear]) => `
    <div class="year-group">
      <div class="year-label">${year}</div>
      ${notesInYear.map(renderNoteCard).join('')}
    </div>
  `).join('');

  const searchInput = document.getElementById('notes-search');
  if (searchInput) {
    const filterRows = () => {
      const q = searchInput.value.toLowerCase().trim();
      notesList.querySelectorAll('.year-group').forEach(group => {
        const groupRows = group.querySelectorAll('.note-row');
        let visibleRows = 0;

        groupRows.forEach(row => {
          const text = (row.querySelector('.note-row__title').textContent + (row.dataset.search || '')).toLowerCase();
          const matches = !q || text.includes(q);
          row.style.display = matches ? '' : 'none';
          if (matches) visibleRows += 1;
        });

        group.style.display = visibleRows > 0 || !q ? '' : 'none';
      });
    };
    searchInput.oninput = filterRows;
    filterRows();
  }
}

function renderHomepageNotes() {
  const root = document.getElementById('home-notes-root');
  if (!root || !window.noteData?.length) return;

  const notes = [...window.noteData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  root.innerHTML = notes.map(renderNoteCard).join('');
}

function renderProjectGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid || !window.projectData?.length) return;

  const language = siteState.currentLanguage;
  const filteredProjects = getFilteredProjects(siteState.activeProjectFilter);

  const cardsMarkup = filteredProjects.map((project, index) => {
    const title = getLocalizedValue(project.title, language);
    const description = getLocalizedValue(project.description, language);
    const tags = (project.tags || []).map(tag => `<span class="tag tag--sage">${tag}</span>`).join('');
    const isFeatured = Boolean(project.featured);
    const isCollapsed = index >= 6 && !siteState.projectsExpanded;
    const cardTitle = isFeatured
      ? `<span class="badge-crown">★ Featured</span> ${title}`
      : title;

    const linksMarkup = (project.links || []).map(link => {
      const href = link.href || '#';
      const label = getLocalizedValue(link.label, language);
      const isDisabled = link.kind === 'disabled';
      const classes = isDisabled ? 'btn btn--disabled' : `btn btn--${link.kind || 'ghost'}`;
      const attrs = link.target ? ` target="${link.target}" rel="noopener noreferrer"` : '';
      const disabledAttrs = isDisabled ? ' aria-disabled="true" tabindex="-1"' : '';
      return `<a href="${href}" class="${classes}"${attrs}${disabledAttrs}>${label}</a>`;
    }).join('');

    return `
      <div class="card project-card reveal ${isCollapsed ? 'project-card--hidden' : ''}" data-tags="${(project.tags || []).join(',')}" data-featured="${isFeatured}" data-collapsed="${String(isCollapsed)}">
        <h2 class="project-card__title">${cardTitle}</h2>
        <p class="project-card__desc">${description}</p>
        <div class="project-card__tags">${tags}</div>
        <div class="project-card__links">${linksMarkup}</div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cardsMarkup;

  const showAllToggle = document.getElementById('toggle-projects-view');
  if (showAllToggle) {
    const hiddenCount = filteredProjects.length > 6 ? filteredProjects.length - 6 : 0;
    showAllToggle.hidden = hiddenCount === 0;
    showAllToggle.textContent = siteState.projectsExpanded
      ? translations[language].showLessProjects
      : translations[language].showAllProjects;
  }

  initializeProjectFiltering();
}

function applyLanguage(language) {
  const selectedLanguage = translations[language] ? language : 'en';
  siteState.currentLanguage = selectedLanguage;
  document.documentElement.lang = selectedLanguage;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const translation = translations[selectedLanguage][element.dataset.i18n];
    if (translation) element.textContent = translation;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const translation = translations[selectedLanguage][element.dataset.i18nPlaceholder];
    if (translation) element.placeholder = translation;
  });
  document.querySelectorAll('[data-language-label]').forEach(label => {
    label.classList.toggle('active', label.dataset.languageLabel === selectedLanguage);
  });
  localStorage.setItem('site-language', selectedLanguage);
  renderFeaturedProject();
  renderProjectGrid();
}

const languageToggle = document.getElementById('language-toggle');
if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    const nextLanguage = (localStorage.getItem('site-language') || 'en') === 'en' ? 'fr' : 'en';
    applyLanguage(nextLanguage);
  });
  applyLanguage(localStorage.getItem('site-language') || 'en');
}

renderFeaturedProject();
renderProjectGrid();
renderHomepageNotes();
renderNotesList();

/* ── Site-wide particle field ────────────────────────────── */
// Reuses the hero's constellation motif as a quiet background on every page.
const siteParticleCanvas = document.createElement('canvas');
siteParticleCanvas.className = 'site-particle-canvas';
siteParticleCanvas.setAttribute('aria-hidden', 'true');
document.body.prepend(siteParticleCanvas);
requestAnimationFrame(() => document.body.classList.add('site-loaded'));

const siteParticleContext = siteParticleCanvas.getContext('2d');
const siteParticleColours = ['#6a8f6e', '#9b8fc4', '#8a9a5b', '#7a5c3a'];
const siteParticlePointer = { x: 0, y: 0, active: false };
let siteParticles = [];
let siteParticleWidth = 0;
let siteParticleHeight = 0;

function resizeSiteParticleCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  siteParticleWidth = window.innerWidth;
  siteParticleHeight = window.innerHeight;
  siteParticleCanvas.width = siteParticleWidth * pixelRatio;
  siteParticleCanvas.height = siteParticleHeight * pixelRatio;
  siteParticleCanvas.style.width = `${siteParticleWidth}px`;
  siteParticleCanvas.style.height = `${siteParticleHeight}px`;
  siteParticleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  siteParticles = Array.from({ length: Math.min(46, Math.max(24, Math.floor(siteParticleWidth / 28))) }, () => ({
    x: Math.random() * siteParticleWidth,
    y: Math.random() * siteParticleHeight,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    radius: 1.2 + Math.random() * 1.5,
    colour: siteParticleColours[Math.floor(Math.random() * siteParticleColours.length)]
  }));
}

function drawSiteParticleFrame() {
  const maxDistance = 135;
  const pointerRadius = 150;
  siteParticleContext.clearRect(0, 0, siteParticleWidth, siteParticleHeight);

  siteParticles.forEach((particle, index) => {
    for (let nextIndex = index + 1; nextIndex < siteParticles.length; nextIndex += 1) {
      const nextParticle = siteParticles[nextIndex];
      const xDistance = particle.x - nextParticle.x;
      const yDistance = particle.y - nextParticle.y;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      if (distance < maxDistance) {
        siteParticleContext.beginPath();
        siteParticleContext.moveTo(particle.x, particle.y);
        siteParticleContext.lineTo(nextParticle.x, nextParticle.y);
        siteParticleContext.strokeStyle = `rgba(106,143,110,${0.08 * (1 - distance / maxDistance)})`;
        siteParticleContext.lineWidth = 1;
        siteParticleContext.stroke();
      }
    }

    if (siteParticlePointer.active) {
      const xDistance = particle.x - siteParticlePointer.x;
      const yDistance = particle.y - siteParticlePointer.y;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      if (distance < pointerRadius) {
        siteParticleContext.beginPath();
        siteParticleContext.moveTo(particle.x, particle.y);
        siteParticleContext.lineTo(siteParticlePointer.x, siteParticlePointer.y);
        siteParticleContext.strokeStyle = `rgba(155,143,196,${0.18 * (1 - distance / pointerRadius)})`;
        siteParticleContext.stroke();
      }
    }

    siteParticleContext.beginPath();
    siteParticleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    siteParticleContext.fillStyle = `${particle.colour}66`;
    siteParticleContext.fill();
  });
}

function animateSiteParticles() {
  siteParticles.forEach(particle => {
    if (siteParticlePointer.active) {
      const xDistance = particle.x - siteParticlePointer.x;
      const yDistance = particle.y - siteParticlePointer.y;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      if (distance > 0 && distance < 150) {
        const force = (1 - distance / 150) * 0.12;
        particle.x += (xDistance / distance) * force;
        particle.y += (yDistance / distance) * force;
      }
    }

    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < -10 || particle.x > siteParticleWidth + 10) particle.vx *= -1;
    if (particle.y < -10 || particle.y > siteParticleHeight + 10) particle.vy *= -1;
  });
  drawSiteParticleFrame();
  requestAnimationFrame(animateSiteParticles);
}

window.addEventListener('resize', resizeSiteParticleCanvas);
window.addEventListener('pointermove', event => {
  siteParticlePointer.x = event.clientX;
  siteParticlePointer.y = event.clientY;
  siteParticlePointer.active = true;
});
window.addEventListener('pointerleave', () => { siteParticlePointer.active = false; });
resizeSiteParticleCanvas();
drawSiteParticleFrame();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) animateSiteParticles();

/* ── Mobile nav toggle ───────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav--open');
  });
}

/* ── Scroll-reveal (subtle, respects prefers-reduced-motion) */
// Elements with class .reveal animate in when they enter view.
// Add class="reveal" to any section or card you want to fade in.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target); // only once
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// CSS that drives the reveal (injected here so it's self-contained)
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  @media (prefers-reduced-motion: no-preference) {
    .reveal { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.985); transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal--visible { opacity: 1; transform: none; }
    .reveal:nth-child(2) { transition-delay: 90ms; }
    .reveal:nth-child(3) { transition-delay: 180ms; }
    .reveal:nth-child(4) { transition-delay: 270ms; }
  }
`;
document.head.appendChild(revealStyle);

/* ── Project filter bar ──────────────────────────────────── */
// Used on projects.html.
// Each project card should have data-tags="python,ml" etc.
// Each filter button should have data-filter="python" etc.
function initializeProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  const fadeDuration = 160;
  const liftOffset = -8;

  const setCardState = (card, visible) => {
    card.style.opacity = visible ? '1' : '0';
    card.style.visibility = 'visible';
    card.style.pointerEvents = visible ? '' : 'none';
    card.style.display = visible ? 'block' : 'none';
    card.style.transform = 'translateY(0)';
    card.style.transitionDelay = '0ms';
    card.setAttribute('aria-hidden', String(!visible));
  };

  filterBtns.forEach(btn => {
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';

    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      siteState.activeProjectFilter = filter;
      siteState.projectsExpanded = false;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderProjectGrid();
    });
  });

  projectCards.forEach(card => setCardState(card, card.dataset.collapsed !== 'true' || siteState.projectsExpanded));
}

const projectsToggle = document.getElementById('toggle-projects-view');
if (projectsToggle) {
  projectsToggle.addEventListener('click', () => {
    const activeFilter = siteState.activeProjectFilter || 'all';
    const matchingProjects = window.projectData?.filter(project => {
      if (activeFilter === 'all') return true;
      const tags = (project.tags || []).map(tag => tag.trim().toLowerCase());
      return tags.includes(activeFilter.toLowerCase());
    }) || [];

    if (matchingProjects.length > 6) {
      siteState.projectsExpanded = !siteState.projectsExpanded;
      renderProjectGrid();
    }
  });
}

/* ── Hero canvas (animated scatter plot) ─────────────────── */
// Draws a soft animated particle constellation in the hero
// right column. Purely decorative — switches off automatically
// if the canvas element isn't present on the page.
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  const W = (heroCanvas.width = 340);
  const H = (heroCanvas.height = 340);

  const PARTICLE_COUNT = 44;
  const COLOURS = ['#6a8f6e', '#9b8fc4', '#8a9a5b', '#7a5c3a'];
  const MAX_DIST = 85;
  const MOUSE_RADIUS = 75; // Interactivity zone around pointer

  const mouse = { x: null, y: null, active: false };

  // Track pointer coordinates relative to the canvas
  function updatePointer(e) {
    const rect = heroCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.x = (clientX - rect.left) * (W / rect.width);
    mouse.y = (clientY - rect.top) * (H / rect.height);
    mouse.active = true;
  }

  heroCanvas.addEventListener('mousemove', updatePointer);
  heroCanvas.addEventListener('touchstart', updatePointer, { passive: true });
  heroCanvas.addEventListener('touchmove', updatePointer, { passive: true });

  function spawnParticle() {
    if (!mouse.active || particles.length >= 72) return;

    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: 2.5 + Math.random() * 2,
      col: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      age: 0,
      maxAge: 180 + Math.random() * 80,
    });
  }

  heroCanvas.addEventListener('pointerdown', event => {
    updatePointer(event);
    spawnParticle();
  });

  const clearPointer = () => { mouse.active = false; };
  heroCanvas.addEventListener('mouseleave', clearPointer);
  heroCanvas.addEventListener('touchend', clearPointer);

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: 2 + Math.random() * 2,
    col: COLOURS[Math.floor(Math.random() * COLOURS.length)],
    age: 0,
    maxAge: Infinity,
  }));

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Particle-to-particle connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(106,143,110,${0.15 * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Particle-to-mouse connections
      if (mouse.active) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_RADIUS) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(155,143,196,${0.35 * (1 - md / MOUSE_RADIUS)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const opacity = p.maxAge === Infinity ? 0.6 : Math.max(0, 1 - p.age / p.maxAge) * 0.8;
      ctx.fillStyle = `${p.col}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });
  }

  let isRunning = false;

  function update() {
    if (!isRunning) return;

    particles.forEach(p => {
      p.age += 1;

      // Gentle mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      if (particles[i].age >= particles[i].maxAge) particles.splice(i, 1);
    }

    drawFrame();
    requestAnimationFrame(update);
  }

  // Proper play/pause loop management
  const visObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!isRunning) {
        isRunning = true;
        update();
      }
    } else {
      isRunning = false;
    }
  });
  visObs.observe(heroCanvas);
}

/* ── Contact form fake-submit ────────────────────────────── */
// Replace this with your actual form handler (Formspree, etc.)
// See: https://formspree.io for a free static-form backend.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sent ✓';
    btn.disabled = true;
    btn.style.background = 'var(--moss)';
    // TODO: replace with real fetch() to your form endpoint
  });
}

/* ── Clipboard copy for code blocks ─────────────────────── */
// Adds a small "copy" button to elements with class .code-preview
document.querySelectorAll('.code-preview').forEach(block => {
  const btn = document.createElement('button');
  btn.textContent = 'copy';
  btn.style.cssText = `
    position:absolute; top:10px; right:12px;
    font-size:11px; font-family:var(--font-mono);
    background:transparent; border:1px solid rgba(255,255,255,.2);
    color:rgba(255,255,255,.5); border-radius:4px;
    padding:2px 8px; cursor:pointer;
  `;
  block.style.position = 'relative';
  block.appendChild(btn);

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(block.innerText.replace('copy', '').trim());
    btn.textContent = 'copied!';
    setTimeout(() => (btn.textContent = 'copy'), 1500);
  });
});
