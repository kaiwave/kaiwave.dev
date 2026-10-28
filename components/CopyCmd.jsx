'use client';
import { useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';

// A shell command with a copy button. The command stays selectable text if the clipboard is unavailable.
export default function CopyCmd({ cmd }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      setDone(false);
    }
  };
  return (
    <div className="copycmd">
      <code>
        <span aria-hidden="true">$ </span>
        {cmd}
      </code>
      <button type="button" onClick={copy} aria-label={done ? 'Copied' : `Copy ${cmd}`}>
        {done ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} weight="bold" aria-hidden="true" />}
        <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
