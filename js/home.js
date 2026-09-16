/* ============================================================
   home.js — hero terminal typing animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /*
   * TWEAK: Edit these lines to change what the terminal "types out".
   * Each string is one line. \n = newline within a line.
   * Color is applied by wrapping in span tags with terminal classes
   * (prompt, cmd, out, comment, err) — see style.css.
   *
   * Since this is raw text (not HTML), we use a different approach:
   * we render it as pre-formatted text with ANSI-style color
   * by injecting HTML after the animation. See renderTerminal() below.
   */

  renderTerminal();
});

/*
 * renderTerminal — builds a syntax-highlighted terminal block.
 * Edit the `lines` array. Each entry is { type, text }.
 * Types: 'prompt-cmd' (cyan prompt + white cmd), 'output', 'comment', 'blank', 'error'
 *
 * TWEAK: change the prompt string (default: ">>> ")
 * TWEAK: change typing speed in opts below
 */
function renderTerminal() {
  const el = document.getElementById('hero-terminal-output');
  if (!el) return;

  // Lines to display — EDIT THESE
  const lines = [
    { type: 'comment',    text: '# welcome to my corner of the universe' },
    { type: 'blank' },
    { type: 'prompt-cmd', text: 'import numpy as np' },
    { type: 'prompt-cmd', text: 'from physics import curiosity, rigor' },
    { type: 'blank' },
    { type: 'prompt-cmd', text: 'print(curiosity.level)' },
    { type: 'output',     text: '∞' },
    { type: 'blank' },
    { type: 'prompt-cmd', text: 'research = ["quantum", "stat_mech", "ML"]' },
    { type: 'prompt-cmd', text: 'print(f"currently: {research[0]}")' },
    { type: 'output',     text: 'currently: quantum' },
    { type: 'blank' },
    { type: 'comment',    text: '# open to collaborations & internships 🚀' },
  ];

  const PROMPT = '>>> ';  // TWEAK: change prompt style (e.g. '$ ', '❯ ', 'In [1]: ')

  let lineIdx = 0;

  function nextLine() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx++];
    appendLine(el, line, PROMPT);
    // TWEAK: change delay between lines (ms)
    setTimeout(nextLine, line.type === 'blank' ? 80 : 160);
  }

  // Small initial delay before typing starts
  setTimeout(nextLine, 400);  // TWEAK: initial pause (ms)
}

function appendLine(container, line, prompt) {
  const div = document.createElement('div');

  switch (line.type) {
    case 'comment':
      div.innerHTML = `<span style="color:var(--text-muted)">${escHtml(line.text)}</span>`;
      break;
    case 'prompt-cmd':
      div.innerHTML = `<span style="color:var(--accent-green)">${escHtml(prompt)}</span><span style="color:var(--text-primary)">${escHtml(line.text)}</span>`;
      break;
    case 'output':
      div.innerHTML = `<span style="color:var(--accent-output)">${escHtml(line.text)}</span>`;
      break;
    case 'error':
      div.innerHTML = `<span style="color:#c0392b">${escHtml(line.text)}</span>`;
      break;
    case 'blank':
      div.innerHTML = '&nbsp;';
      break;
    default:
      div.textContent = line.text;
  }

  container.appendChild(div);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}