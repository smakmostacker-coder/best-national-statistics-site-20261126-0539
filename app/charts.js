// charts.js — small SVG chart builders, no libraries, no network.
// Every chart is drawn from the dataset in data.js and returns an SVG string.

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function niceMax(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pad = span * 0.12;
  return { lo: Math.max(0, min - pad), hi: max + pad };
}

// Line chart: points = [{x: label, y: number}], value shown on hover via <title>.
export function lineChart(points, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 260;
  const padL = 52, padR = 14, padT = 14, padB = 30;
  const ys = points.map((p) => p.y);
  const { lo, hi } = niceMax(ys);
  const xAt = (i) => padL + (i * (w - padL - padR)) / Math.max(1, points.length - 1);
  const yAt = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo);
  const color = opts.color || '#0e6b6b';
  const fmt = opts.format || ((v) => String(v));
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const v = lo + f * (hi - lo);
    const y = yAt(v);
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e3e8ea" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5a6b72">${esc(fmt(v))}</text>`;
  }).join('');
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)}`).join(' ');
  const area = `${path} L${xAt(points.length - 1).toFixed(1)},${h - padB} L${xAt(0).toFixed(1)},${h - padB} Z`;
  const dots = points.map((p, i) =>
    `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(p.y).toFixed(1)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2">` +
    `<title>${esc(p.x)}: ${esc(fmt(p.y))}</title></circle>`).join('');
  const labels = points.map((p, i) =>
    `<text x="${xAt(i)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#5a6b72">${esc(p.x)}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.label || 'Line chart')}" ` +
    `preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block"><title>${esc(opts.label || 'Line chart')}</title>${grid}` +
    `<path d="${area}" fill="${color}" opacity="0.10"/>` +
    `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `${dots}${labels}</svg>`;
}

// Vertical bar chart: bars = [{x: label, y: number}].
export function barChart(bars, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 260;
  const padL = 52, padR = 14, padT = 14, padB = 30;
  const ys = bars.map((b) => b.y);
  const hi = Math.max(...ys) * 1.12;
  const lo = Math.min(0, Math.min(...ys) * 1.1);
  const slot = (w - padL - padR) / bars.length;
  const bw = Math.min(46, slot * 0.62);
  const yAt = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo);
  const color = opts.color || '#14456b';
  const fmt = opts.format || ((v) => String(v));
  const grid = [0, 0.5, 1].map((f) => {
    const v = lo + f * (hi - lo);
    const y = yAt(v);
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e3e8ea" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5a6b72">${esc(fmt(v))}</text>`;
  }).join('');
  const rects = bars.map((b, i) => {
    const x = padL + i * slot + (slot - bw) / 2;
    const y = yAt(Math.max(0, b.y));
    const hh = Math.abs(yAt(0) - yAt(b.y));
    const fill = b.highlight ? '#c98a1b' : color;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, hh).toFixed(1)}" rx="3" fill="${fill}">` +
      `<title>${esc(b.x)}: ${esc(fmt(b.y))}</title></rect>`;
  }).join('');
  const labels = bars.map((b, i) =>
    `<text x="${padL + i * slot + slot / 2}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#5a6b72">${esc(b.x)}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.label || 'Bar chart')}" ` +
    `preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block">${grid}${rects}${labels}</svg>`;
}

// Donut chart with a legend list beside it.
export function donutChart(slices, opts = {}) {
  const size = 190;
  const r = 74;
  const cx = size / 2, cy = size / 2;
  const total = slices.reduce((s, d) => s + d.value, 0);
  const palette = opts.palette || ['#14456b', '#0e6b6b', '#c98a1b', '#7a9bb5', '#4a7d5c', '#8a6d9b'];
  let angle = -Math.PI / 2;
  const paths = slices.map((s, i) => {
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} ` +
      `L ${cx + (r - 34) * Math.cos(a1)} ${cy + (r - 34) * Math.sin(a1)} ` +
      `A ${r - 34} ${r - 34} 0 ${large} 0 ${cx + (r - 34) * Math.cos(a0)} ${cy + (r - 34) * Math.sin(a0)} Z" ` +
      `fill="${palette[i % palette.length]}"><title>${esc(s.label)}: ${s.value}%</title></path>`;
  }).join('');
  const legend = slices.map((s, i) =>
    `<li><span class="swatch" style="background:${palette[i % palette.length]}"></span>` +
    `${esc(s.label)} <strong>${s.value}%</strong></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" ` +
    `aria-label="${esc(opts.label || 'Donut chart')}" style="width:190px;height:190px;flex:none">${paths}` +
    `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="#12262e">${esc(opts.center || '')}</text>` +
    `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#5a6b72">${esc(opts.centerSub || '')}</text></svg>` +
    `<ul class="legend">${legend}</ul></div>`;
}

// Horizontal comparison bars, used for regions.
export function hbarChart(rows, opts = {}) {
  const max = Math.max(...rows.map((r) => r.value));
  const fmt = opts.format || ((v) => String(v));
  return `<ul class="hbars">` + rows.map((r) =>
    `<li><span class="hbar-label">${esc(r.label)}</span>` +
    `<span class="hbar-track"><span class="hbar-fill" style="width:${((r.value / max) * 100).toFixed(1)}%;background:${r.color || '#0e6b6b'}"></span></span>` +
    `<span class="hbar-value">${esc(fmt(r.value))}</span></li>`).join('') + `</ul>`;
}
