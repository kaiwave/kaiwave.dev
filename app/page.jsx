import { Fragment } from 'react';
import { ArrowUpRight, GithubLogo, LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import Projects from '@/components/Projects';
import PaletteWord from '@/components/PaletteWord';
import Writing from '@/components/Writing';
import { site, projects, showcase, allWriting, credits, typo } from '@/lib/content';

const fmtDay = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
const ext = { target: '_blank', rel: 'noopener' };

// One flat colour per letter of the wordmark; the same set colours the cards.
const palette = ['orange', 'pink', 'yellow', 'blue', 'green', 'coral', 'mint'];
const letters = ['k', 'a', 'i', 'w', 'a', 'v', 'e'];
const nav = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Writing', '#writing'],
  ['Contact', '#contact'],
];

// A sine-like wave from x=0 to `width`; drawn 2x wider than shown so sliding it one period loops seamlessly.
const wave = (width, period, mid, amp) =>
  `M0 ${mid} ` +
  Array.from({ length: Math.ceil(width / period) }, (_, i) => {
    const x = i * period;
    return `Q${x + period / 4} ${mid - amp} ${x + period / 2} ${mid} T${x + period} ${mid}`;
  }).join(' ');

// "Hi, I'm {Malakai}": the braced word gets a random palette colour.
const braced = (s) => s.split(/[{}]/).map((part, i) => (i % 2 ? <PaletteWord key={i}>{part}</PaletteWord> : part));

// Projects keep their own colour wherever they appear (filters, show all).
const coloured = projects.map((p, i) => ({ ...p, colour: palette[i % palette.length] }));
// Filters: any tag at least two projects share, most common first.
const tagCount = projects.flatMap((p) => p.tags).reduce((m, t) => m.set(t, (m.get(t) ?? 0) + 1), new Map());
const filters = [...tagCount].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).map(([t]) => t);

export default function Home() {
  const featured = projects.find((p) => p.featured);
  const writing = allWriting().map((w) => ({ ...w, year: w.date.slice(0, 4), day: fmtDay(w.date), away: w.href.startsWith('http') }));
  // Credit only the found photographs this page can show.
  const shown = new Set([site.showcase.image, ...projects.map((p) => p.image)]);
  const used = credits.filter((c) => shown.has(c.file.replace(/^public/, '')));

  return (
    <main id="main">
      {/* A faint, slow background: three waves and a few floating pucks in the palette. */}
      <div className="drift" aria-hidden="true">
        {['pink', 'blue', 'mint'].map((c, i) => (
          <svg key={c} className={`drift-wave c-${c}`} style={{ '--n': i }} viewBox="0 0 2880 200" preserveAspectRatio="none">
            <path d={wave(2880, 960, 100, 70)} />
          </svg>
        ))}
        {['orange', 'yellow', 'green', 'coral', 'pink'].map((c, i) => (
          <span key={c} className={`puck c-${c}`} style={{ '--n': i }} />
        ))}
      </div>

      {/* Hero: the wordmark; touching a letter gives it its own springy move (components/Boing.jsx) */}
      <section className="hero" aria-labelledby="hero-title">
        <nav className="topnav" aria-label="Sections">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <h1 id="hero-title" className="wordmark">
          <span className="sr-only">kaiwave, the portfolio of {site.name}</span>
          {letters.map((l, i) => (
            <span key={i} className={`letter c-${palette[i]}`} data-b={i} style={{ '--i': i }} aria-hidden="true">
              <span className="glyph">{l}</span>
            </span>
          ))}
        </h1>
        <svg className="hero-wave" viewBox="0 0 2880 60" preserveAspectRatio="none" aria-hidden="true">
          <path d={wave(2880, 720, 30, 28)} />
        </svg>
        <div className="hero-foot">
          <p className="hero-lede">{typo(site.hero.lede)}</p>
          <a className="btn" href={site.cv} {...ext}>
            {site.hero.cta} <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Statement: words fill in as you scroll, over a wave that draws itself and keeps flowing */}
      <section className="statement" aria-label="What I work on">
        <svg className="wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d={wave(2880, 720, 80, 60)} />
        </svg>
        <p>
          {typo(site.statement)
            .split(' ')
            .map((w, i) => (
              <span key={i} className="word">
                {w}{' '}
              </span>
            ))}
        </p>
      </section>

      {/* Work: colour cards, top few first, the rest behind "Show all", with tag filters */}
      <section className="work" id="work" aria-labelledby="work-title" data-reveal>
        <h2 id="work-title" className="r">
          {site.projects.title}
        </h2>
        <div className="r" style={{ '--i': 1 }}>
          <Projects projects={coloured} filters={filters} showFirst={site.projects.showFirst} />
        </div>
      </section>

      {/* Showcase: the featured project's live output as cards over a photo (content/showcase.json) */}
      {featured && (
        <section className="showcase" aria-labelledby="bs-title" data-reveal>
          <img className="bleed" src={site.showcase.image} alt="" width="1920" height="1440" loading="lazy" />
          <div className="showcase-copy r">
            <h2 id="bs-title">{showcase.title}</h2>
            <p>{typo(site.showcase.text)}</p>
            <a className="text-link" href={featured.links[0].href} {...ext}>
              {site.showcase.cta} <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
          <ol className="players" aria-label={showcase.title}>
            {showcase.cards.map((card, i) => (
              <li key={card.title} className="player r" style={{ '--i': i + 1 }}>
                {card.badge && <span className="player-rating">{card.badge}</span>}
                <strong>{card.title}</strong>
                {card.subtitle && <span className="player-pos">{card.subtitle}</span>}
                {card.rows?.map(([label, value]) => (
                  <span className="kv" key={label}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </span>
                ))}
              </li>
            ))}
            {featured.code && (
              <li className="player player-code r" style={{ '--i': showcase.cards.length + 1 }}>
                <strong>{site.showcase.codeTitle}</strong>
                <pre>
                  <code>{featured.code}</code>
                </pre>
              </li>
            )}
          </ol>
        </section>
      )}

      {/* About: a photo card and a short letter */}
      <section className="about" id="about" aria-labelledby="about-title" data-reveal>
        <figure className="photo-card c-pink r">
          <img src="/img/headshot.jpg" alt={site.about.photoAlt} width="1200" height="1200" loading="lazy" />
          <figcaption>{site.about.caption}</figcaption>
        </figure>
        <div className="about-text r" style={{ '--i': 1 }}>
          <h2 id="about-title">{braced(typo(site.about.title))}</h2>
          {site.about.paragraphs.map((t) => (
            <p key={t}>{typo(t)}</p>
          ))}
        </div>
      </section>

      {/* Record: a short table */}
      <section className="record" aria-labelledby="record-title" data-reveal>
        <h2 id="record-title" className="r">
          {site.recordTitle}
        </h2>
        <table className="r" style={{ '--i': 1 }}>
          <thead className="sr-only">
            <tr>
              <th scope="col">When</th>
              <th scope="col">What</th>
              <th scope="col">Detail</th>
              <th scope="col">Where</th>
            </tr>
          </thead>
          <tbody>
            {site.record.map((r, i) => (
              <tr key={r.what}>
                <td>
                  <span className={`chip c-${palette[(i * 2) % palette.length]}`}>{r.when}</span>
                </td>
                <th scope="row">{r.what}</th>
                <td>{r.detail}</td>
                <td>{r.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Writing: an index by year */}
      <section className="writing" id="writing" aria-labelledby="writing-title" data-reveal>
        <h2 id="writing-title" className="r">
          {site.writingTitle}
        </h2>
        <Writing items={writing} showFirst={site.writingShowFirst} />
      </section>

      {/* Contact and close */}
      <footer className="close" id="contact" data-reveal>
        <h2 className="giant wordmark r">
          <span className="sr-only">{site.close.title}</span>
          {site.close.title.split(' ').map((word, w, words) => {
            const offset = words.slice(0, w).join('').length;
            return (
              <Fragment key={word}>
                {w > 0 && ' '}
                <span className="giant-word" aria-hidden="true">
                  {word.split('').map((ch, i) => (
                    <span key={i} className={`letter c-${palette[(offset + i) % palette.length]}`} data-b={(offset + i) % 7}>
                      <span className="glyph">{ch}</span>
                    </span>
                  ))}
                </span>
              </Fragment>
            );
          })}
        </h2>
        <div className="close-row r" style={{ '--i': 1 }}>
          <a className="btn" href={`mailto:${site.email}?subject=${encodeURIComponent(site.close.emailSubject)}`}>
            {site.close.cta} <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
          </a>
          <p>
            {site.email}
            <br />
            {site.location[0]}, {site.location[1]}
          </p>
          <p className="close-links">
            <a href={site.github} {...ext}>
              <GithubLogo size={22} aria-hidden="true" /> GitHub
            </a>
            <a href={site.linkedin} {...ext}>
              <LinkedinLogo size={22} aria-hidden="true" /> LinkedIn
            </a>
          </p>
        </div>
        <p className="imprint">
          &copy; 2026 {site.name}. Photographs:{' '}
          {used.map((c, i) => (
            <span key={c.file}>
              <a href={c.page} {...ext}>
                {c.title}
              </a>{' '}
              by {c.creator.replace(/\s*\(.*\)\s*$/, '')}, {c.license}
              {i < used.length - 1 ? '; ' : '.'}
            </span>
          ))}
        </p>
      </footer>
    </main>
  );
}
