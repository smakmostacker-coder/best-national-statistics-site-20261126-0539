// format.js — number and table helpers shared by every view.

export function fmtInt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function fmt1(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function fmt2(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function pct(n) {
  return fmt1(n) + '%';
}

export function deltaLabel(now, before, suffix = '') {
  const d = now - before;
  const sign = d > 0 ? '+' : d < 0 ? '−' : '';
  return sign + fmt1(Math.abs(d)) + suffix;
}

// Sortable table: headers = [{key, label, numeric}], rows = arrays of cell HTML.
// Clicking a header re-sorts; the table re-renders in place.
export function sortableTable(id, headers, rows, sortKey, sortDir) {
  const head = headers.map((h) => {
    const arrow = h.key === sortKey ? (sortDir === 1 ? ' ▲' : ' ▼') : '';
    return `<th data-sort="${h.key}" class="${h.numeric ? 'num' : ''}" scope="col">${h.label}${arrow}</th>`;
  }).join('');
  const body = rows.map((r) =>
    `<tr>${r.map((c, i) => `<td class="${headers[i] && headers[i].numeric ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('');
  return `<table class="data-table" id="${id}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function sourceNote(text) {
  return `<p class="source">Source: ${text}. Figures are final unless marked provisional (p) or estimated (e).</p>`;
}
