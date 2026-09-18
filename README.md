# kaiwave.dev

My personal portfolio site.

Live site: [https://kaiwave.dev](https://kaiwave.dev)

---

## Overview
A lightweight, dependency-free static website built with HTML, vanilla CSS, and JavaScript. The site showcases my computational physics projects, academic research notes, other personal projects, and some posts and publications.

### Key Features
- **Bilingual (EN/FR):** Custom client-side internationalisation engine using `data-i18n` attribute parsing.

- **Clean Routing:** Directory-based structure (`/about/`, `/projects/`, `/notes/`, `/contact/`) configured for clean URLs via GitHub Pages.

- **Dynamic Content & Search:** Fast client-side filtering and rendering for notes and project catalogues powered by modular data stores (`notes-data.js`, `projects-data.js`).

- **Responsive & Accessible:** Custom CSS design system with CSS custom properties, responsive layouts, and screen-reader considerations.

## Directory Structure

```text
kaiwave.dev/
├── index.html              # Landing / hero page
├── CNAME                   # Custom domain configuration (kaiwave.dev)
├── assets/                 # Profile images, icons, and static media
├── css/
│   └── style.css           # Global stylesheets, CSS tokens, and layout rules
├── js/
│   ├── main.js             # Core logic, i18n handler, interactive canvas/components
│   ├── notes-data.js       # Data definitions for notes and articles
│   └── projects-data.js    # Data definitions for project cards and links
├── about/
│   └── index.html          # About page & biography
├── projects/
│   └── index.html          # Interactive projects showcase
├── notes/
│   └── index.html          # Writing, course summaries, and searchable notes
└── contact/
    └── index.html          # Contact form and social links