// main.js — router and controls for the Caldoria statistics site.
// Hash routes: #/ #/population #/economy #/employment #/prices #/regions
// #/explorer #/methodology. No network requests; all data is local.

import { VIEWS } from './views.js';
import { YEARS, POPULATION, ECONOMY, EMPLOYMENT, PRICES, rowFor } from './data.js';

const app = document.getElementById('app');
const nav = document.getElementById('site-nav');
const navToggle = document.getElementById('nav-toggle');

const state = {
  year: 2026,
  query: '',
  topic: 'All',
  yearFilter: null,
  regionSort: 'pop',
  regionDir: -1,
};

function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const path = hash.split('?')[0];
  return VIEWS[path] ? path : '/';
}

function render() {
  const path = route();
  app.innerHTML = VIEWS[path](state);
  document.querySelectorAll('#site-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === path);
  });
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  wireControls(path);
}

// Re-sort a table when its heading is clicked. Reads the current rows from
// the DOM, sorts numerically when both cells parse as numbers, and rewrites
// the tbody in place.
function sortTable(table, keyIndex, dir) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const num = (cell) => {
    const t = cell.textContent.replace(/[^0-9.\-]/g, '');
    return t === '' || t === '-' ? null : Number(t);
  };
  rows.sort((a, b) => {
    const an = num(a.cells[keyIndex]);
    const bn = num(b.cells[keyIndex]);
    if (an !== null && bn !== null) return (an - bn) * dir;
    return a.cells[keyIndex].textContent.localeCompare(b.cells[keyIndex].textContent) * dir;
  });
  rows.forEach((r) => tbody.appendChild(r));
  const heads = table.tHead.rows[0].cells;
  Array.from(heads).forEach((h, i) => {
    h.textContent = h.textContent.replace(/ [▲▼]$/, '');
    if (i === keyIndex) h.textContent += dir === 1 ? ' ▲' : ' ▼';
  });
}

function wireControls(path) {
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      state.year = Number(yearSelect.value);
      render();
    });
  }

  // Sortable tables: one click toggles direction, stored per table.
  // The regions table is handled separately below (it re-renders from state).
  document.querySelectorAll('.data-table').forEach((table) => {
    if (table.id === 'region-table') return;
    let dir = -1;
    let last = -1;
    table.querySelectorAll('th[data-sort]').forEach((th, i) => {
      th.addEventListener('click', () => {
        dir = i === last ? -dir : 1;
        last = i;
        sortTable(table, i, dir);
      });
    });
  });

  if (path === '/regions') {
    const regionTable = document.getElementById('region-table');
    if (regionTable) {
      const keys = ['name', 'pop', 'gdpPc', 'unemp', 'area', 'gdp'];
      regionTable.querySelectorAll('th[data-sort]').forEach((th, i) => {
        th.addEventListener('click', () => {
          const key = keys[i];
          if (state.regionSort === key) {
            state.regionDir = -state.regionDir;
          } else {
            state.regionSort = key;
            state.regionDir = key === 'name' ? 1 : -1;
          }
          render();
        });
      });
    }
  }

  if (path === '/explorer') {
    const search = document.getElementById('explorer-search');
    const topic = document.getElementById('explorer-topic');
    const yearEl = document.getElementById('explorer-year');
    const csvBtn = document.getElementById('explorer-csv');
    if (search) {
      search.addEventListener('input', () => { state.query = search.value; render(); restoreFocus(search); });
    }
    if (topic) topic.addEventListener('change', () => { state.topic = topic.value; render(); });
    if (yearEl) yearEl.addEventListener('change', () => {
      state.yearFilter = yearEl.value ? Number(yearEl.value) : null;
      render();
    });
    if (csvBtn) csvBtn.addEventListener('click', downloadCsv);
  }
}

function restoreFocus(input) {
  const el = document.getElementById('explorer-search');
  if (el) {
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }
}

// CSV of the explorer's current filtered rows, built locally and downloaded
// with a blob URL — no server, no network.
function downloadCsv() {
  const q = (state.query || '').toLowerCase();
  const lines = ['year,topic,indicator,value'];
  YEARS.forEach((y) => {
    const p = rowFor(POPULATION, y), e = rowFor(ECONOMY, y);
    const m = rowFor(EMPLOYMENT, y), c = rowFor(PRICES, y);
    const rows = [
      [y, 'Population', 'Population (thousands)', p.total],
      [y, 'Economy', 'GDP (KM bn)', e.gdp],
      [y, 'Economy', 'Real GDP growth (%)', e.growth],
      [y, 'Employment', 'Unemployment (%)', m.unemp],
      [y, 'Employment', 'Average monthly wage (KM)', m.wage],
      [y, 'Prices', 'CPI inflation (%)', c.cpi],
      [y, 'Population', 'Life expectancy (years)', p.lifeExp],
    ];
    rows.forEach(([year, topic, ind, val]) => {
      if ((!q || ind.toLowerCase().includes(q) || topic.toLowerCase().includes(q)) &&
          (!state.topic || state.topic === 'All' || topic === state.topic) &&
          (!state.yearFilter || year === state.yearFilter)) {
        lines.push(`${year},${topic},"${ind}",${val}`);
      }
    });
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'caldoria-statistics.csv';
  a.click();
  URL.revokeObjectURL(url);
}

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('hashchange', render);
render();
