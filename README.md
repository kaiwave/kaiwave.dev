# portfolio

Personal portfolio site for a physics / math undergrad. Built with plain HTML, CSS, and vanilla JS — no build step, no frameworks.

## pages

| file | purpose |
|------|---------|
| `index.html` | Home / landing |
| `pages/projects.html` | Project grid with filter bar |
| `pages/notes.html` | Blog / notes list with live search |
| `pages/about.html` | Bio, skills, coursework timeline |
| `pages/contact.html` | Contact form + social links |

## deploying to GitHub Pages

1. Push this folder to a GitHub repo named `yourusername.github.io`  
   (or any repo — Pages works on any branch)
2. Go to **Settings → Pages** in your repo
3. Set Source to **Deploy from a branch**, pick `main`, folder `/`
4. Visit `https://yourusername.github.io` — done.

> **Custom domain?** Add a file named `CNAME` to the root with just your domain on one line, e.g. `yourname.com`. Then point your DNS A records to GitHub's IPs.

## customising

### palette
All colours are CSS variables in `:root` inside `css/style.css`. Change them once, they update everywhere.

### fonts
Find the `@import` at the top of `css/style.css` and swap the Google Fonts URL. Update `--font-sans` and `--font-mono`.

### nav logo
Edit the `.nav__logo` text in every HTML file (search for `nav__logo`).

### contact form
The form currently fakes a submit (for demo). To make it real:
1. Sign up at https://formspree.io (free tier is plenty)
2. Create a form, copy your endpoint URL
3. Set `action="https://formspree.io/f/YOUR_ID"` on `<form>` in `contact.html`
4. Remove the fake-submit block in `js/main.js`

### adding a project
Copy any `.card.project-card` block in `pages/projects.html`, update the content, and make sure `data-tags` matches one of your filter buttons.

### adding a note
Copy a `.note-row` block in `pages/notes.html`. The `data-search` attribute feeds the live search — add relevant keywords there.

## file structure

```
portfolio/
├── index.html
├── css/
│   └── style.css        ← all styles + design tokens
├── js/
│   └── main.js          ← nav, canvas, filter, search, clipboard
├── pages/
│   ├── projects.html
│   ├── notes.html
│   ├── about.html
│   └── contact.html
├── assets/              ← put your photo, CV PDF, etc. here
│   └── icons/
└── README.md
```
