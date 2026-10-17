'use client';
import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

const ext = { target: '_blank', rel: 'noopener' };

// Posts grouped by year. `continues` skips the year label when the group carries on a year shown above.
function Years({ items, continues, reveal }) {
  const years = [...new Set(items.map((w) => w.year))];
  return years.map((y, k) => (
    <div className={`year${reveal ? ' r' : ''}`} key={y} style={{ '--i': 1, '--k': k }}>
      {k === 0 && continues === y ? <span aria-hidden="true" /> : <h3>{y}</h3>}
      <ul>
        {items
          .filter((w) => w.year === y)
          .map((w) => (
            <li key={w.id}>
              <a href={w.href} {...(w.away ? ext : {})}>
                <span className="item">{w.title}</span>
                <span className={`where c-${w.away ? 'blue' : 'orange'}`}>{w.away ? 'LinkedIn' : 'This site'}</span>
                <span className="date">{w.day}</span>
              </a>
            </li>
          ))}
      </ul>
    </div>
  ));
}

export default function Writing({ items, showFirst = 10 }) {
  const [open, setOpen] = useState(false);
  const top = items.slice(0, showFirst);
  const rest = items.slice(showFirst);
  return (
    <>
      <Years items={top} reveal />
      {rest.length > 0 && (
        <>
          <div className={`more${open ? ' open' : ''}`} id="more-writing" inert={!open || undefined}>
            <div className="more-inner">
              <Years items={rest} continues={top.at(-1)?.year} />
            </div>
          </div>
          <button type="button" className="show-all" aria-expanded={open} aria-controls="more-writing" onClick={() => setOpen(!open)}>
            {open ? 'Show fewer' : 'Show older'}
            <CaretDown size={18} weight="bold" aria-hidden="true" />
          </button>
        </>
      )}
    </>
  );
}
