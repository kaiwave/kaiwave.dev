'use client';
import { useEffect, useRef, useState } from 'react';

// Benchmark lines on a log time axis. Hover (or arrow keys) shows every simulator at one qubit count.
// Colours were checked with the dataviz palette validator on the #111214 surface; the grey dashed
// line is a reference, so it is told apart by dash and label rather than hue.
export const fmt = (s) =>
  s >= 1 ? `${+s.toPrecision(3)} s` : s >= 1e-3 ? `${+(s * 1e3).toPrecision(3)} ms` : `${+(s * 1e6).toPrecision(2)} µs`;

const TICKS = [1e-4, 1e-3, 1e-2, 1e-1, 1, 10];
const LO = 1.5e-5;
const HI = 40;

export default function BenchChart({ qubits, series }) {
  const box = useRef(null);
  const [w, setW] = useState(760);
  const [at, setAt] = useState(null);
  const [table, setTable] = useState(false);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const narrow = w < 560;
  const h = narrow ? 300 : 380;
  const m = { l: 62, r: narrow ? 14 : 138, t: 14, b: 40 };
  const x = (q) => m.l + ((q - qubits[0]) / (qubits.at(-1) - qubits[0])) * (w - m.l - m.r);
  const y = (s) => m.t + (1 - (Math.log10(s) - Math.log10(LO)) / (Math.log10(HI) - Math.log10(LO))) * (h - m.t - m.b);
  const path = (sec) =>
    sec
      .map((s, i) => (s == null ? null : `${x(qubits[i])},${y(s)}`))
      .filter(Boolean)
      .map((p, i) => (i ? 'L' : 'M') + p)
      .join('');

  // End labels at each line's last point, nudged apart so none overlap.
  const ends = series
    .map((s) => {
      const i = s.seconds.findLastIndex((v) => v != null);
      return { ...s, i, ly: y(s.seconds[i]) };
    })
    .sort((a, b) => a.ly - b.ly);
  ends.forEach((e, k) => {
    if (k) e.ly = Math.max(e.ly, ends[k - 1].ly + 44);
  });

  const pick = (clientX) => {
    const r = box.current.getBoundingClientRect();
    const q = qubits[0] + ((clientX - r.left - m.l) / (w - m.l - m.r)) * (qubits.at(-1) - qubits[0]);
    setAt(Math.max(0, Math.min(qubits.length - 1, Math.round(q - qubits[0]))));
  };
  const key = (e) => {
    const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!d) return;
    e.preventDefault();
    setAt((i) => Math.max(0, Math.min(qubits.length - 1, (i ?? qubits.length - 1) + d)));
  };

  return (
    <div className="bench" ref={box}>
      <ul className="bench-legend">
        {series.map((s) => (
          <li key={s.name}>
            <i className={s.dashed ? 'dashed' : ''} style={{ '--c': s.colour }} aria-hidden="true" />
            {s.name}
          </li>
        ))}
      </ul>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        tabIndex={0}
        role="img"
        aria-label={`Run time against qubit count, log scale. At ${qubits.at(-1)} qubits: ${series
          .filter((s) => s.seconds.at(-1) != null)
          .map((s) => `${s.name} ${fmt(s.seconds.at(-1))}`)
          .join(', ')}. Use the left and right arrow keys to read other qubit counts.`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setAt(null)}
        onKeyDown={key}
        onBlur={() => setAt(null)}
      >
        {TICKS.map((t) => (
          <g key={t} className="bench-grid">
            <line x1={m.l} x2={w - m.r} y1={y(t)} y2={y(t)} />
            <text x={m.l - 10} y={y(t)} dy="0.35em" textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}
        {qubits
          .filter((q) => q % 4 === 2)
          .map((q) => (
            <text key={q} className="bench-x" x={x(q)} y={h - m.b + 22} textAnchor="middle">
              {q}
            </text>
          ))}
        <text className="bench-x" x={w - m.r} y={h - 4} textAnchor="end">
          qubits
        </text>
        {series.map((s) => (
          <path
            key={s.name}
            className={`bench-line${s.dashed ? ' dashed' : ''}`}
            d={path(s.seconds)}
            style={{ stroke: s.colour }}
          />
        ))}
        {!narrow &&
          ends.map((e) => (
            <g key={e.name} className="bench-end">
              <circle cx={x(qubits[e.i])} cy={y(e.seconds[e.i])} r="4" style={{ fill: e.colour }} />
              <text x={x(qubits[e.i]) + 12} y={e.ly} dy="0.35em">
                <tspan className="bench-end-name">{e.name}</tspan>
                <tspan x={x(qubits[e.i]) + 12} dy="1.25em">
                  {fmt(e.seconds[e.i])}
                </tspan>
              </text>
            </g>
          ))}
        {at != null && (
          <g className="bench-hover">
            <line x1={x(qubits[at])} x2={x(qubits[at])} y1={m.t} y2={h - m.b} />
            {series.map(
              (s) =>
                s.seconds[at] != null && (
                  <circle key={s.name} cx={x(qubits[at])} cy={y(s.seconds[at])} r="5" style={{ fill: s.colour }} />
                ),
            )}
          </g>
        )}
      </svg>
      {at != null && (
        <div className="bench-tip" style={{ left: Math.min(x(qubits[at]) + 14, w - 190) }} aria-hidden="true">
          <strong>{qubits[at]} qubits</strong>
          {series.map((s) => (
            <span key={s.name}>
              <i className={s.dashed ? 'dashed' : ''} style={{ '--c': s.colour }} />
              {s.name}
              <b>{s.seconds[at] == null ? 'not run' : fmt(s.seconds[at])}</b>
            </span>
          ))}
        </div>
      )}
      <details className="bench-table" onToggle={(e) => setTable(e.currentTarget.open)}>
        <summary>See the numbers</summary>
        {table && (
          <table>
            <thead>
              <tr>
                <th scope="col">Qubits</th>
                {series.map((s) => (
                  <th scope="col" key={s.name}>
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qubits.map((q, i) => (
                <tr key={q}>
                  <th scope="row">{q}</th>
                  {series.map((s) => (
                    <td key={s.name}>{s.seconds[i] == null ? 'not run' : fmt(s.seconds[i])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </details>
    </div>
  );
}
