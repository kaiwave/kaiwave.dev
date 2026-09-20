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

- **Easy posting:** `helper.py` makes creating and editing new posts and notes intuitive and simple with a basic GUI and handles all formatting and syntax automatically.

## Directory Structure

```text
kaiwave.dev/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── site/               <-- Everything published to the web lives here
│   ├── CNAME
│   ├── index.html      <-- Homepage of site
│   ├── css/
│   ├── js/
│   ├── projects/       <-- Projects page of site, will have subdirectories for individual projects
│   └── notes/          <-- Posts page of site, will have subdirectories for individual posts
├── scripts/               
│   └── helper.py       <-- Gnerator and helper scripts for easy adding of notes and projects
└── README.md
