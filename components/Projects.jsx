'use client';
import { useState } from 'react';
import { ArrowUpRight, CaretDown } from '@phosphor-icons/react';
import { bento } from '@/lib/bento.mjs';

const ext = { target: '_blank', rel: 'noopener' };
const status = (p) =>
  p.status ? 'in progress' : { Report: 'report', 'Visit site': 'live', GitHub: 'open source' }[p.links[0]?.label] ?? '';

function Card({ p, span, k }) {
  return (
    <li className={`card c-${p.colour} ${span}`} style={{ '--k': k }}>
      {p.image && <img className="card-img" src={p.image} alt="" width="900" height="600" loading="lazy" />}
      <div className="card-head">
        <h3>
          {p.links[0] ? (
            <a className="card-link" href={p.links[0].href} {...ext}>
              {p.short}
            </a>
          ) : (
            p.short
          )}
        </h3>
        <p className="card-status">{status(p)}</p>
      </div>
      <p className="card-desc">{p.description.en}</p>
      <ul className="tags" aria-label="Tags">
        {[p.kind, ...p.tags].slice(0, 4).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {p.links[1] && (
        <a className="card-second" href={p.links[1].href} {...ext}>
          {p.links[1].label} <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}

const Grid = ({ list, className = '' }) => {
  const spans = bento(list.length);
  return (
    <ul className={`bento ${className}`}>
      {list.map((p, i) => (
        <Card key={p.id} p={p} span={spans[i]} k={i} />
      ))}
    </ul>
  );
};

export default function Projects({ projects, filters, showFirst = 4 }) {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const top = projects.slice(0, showFirst);
  const rest = projects.slice(showFirst);
  const matches = filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {['all', ...filters].map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filter === 'all' ? (
        <>
          <Grid list={top} />
          {rest.length > 0 && (
            <>
              <div className={`more${open ? ' open' : ''}`} id="more-projects" inert={!open || undefined}>
                <div className="more-inner">
                  <Grid list={rest} />
                </div>
              </div>
              <button type="button" className="show-all" aria-expanded={open} aria-controls="more-projects" onClick={() => setOpen(!open)}>
                {open ? 'Show fewer' : `Show all ${projects.length} projects`}
                <CaretDown size={18} weight="bold" aria-hidden="true" />
              </button>
            </>
          )}
        </>
      ) : (
        // Keyed by filter so the cards fade in again each time it changes.
        <Grid key={filter} list={matches} className="filtered" />
      )}
      <p className="sr-only" aria-live="polite">
        {filter === 'all' ? '' : `${matches.length} projects tagged ${filter}`}
      </p>
    </>
  );
}
