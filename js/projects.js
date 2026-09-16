/* ============================================================
   projects.js — filter logic
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const btns  = document.querySelectorAll('.filter-btn');
  const rows  = document.querySelectorAll('.project-row');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      rows.forEach(row => {
        const tags = (row.dataset.tags || '').split(' ');
        if (filter === 'all' || tags.includes(filter)) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
    });
  });
});