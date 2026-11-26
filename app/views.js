// views.js — every page of the Caldoria statistics site.
// Each view is a function(state) returning HTML. All figures come from data.js;
// charts come from charts.js. State: { year, region, query, sortKey, sortDir, tab }.

import {
  COUNTRY, YEARS, POPULATION, AGE_GROUPS, ECONOMY, SECTORS,
  EMPLOYMENT, PRICES, REGIONS, TRADE_PARTNERS, KEY_INDICATORS, rowFor,
} from './data.js';
import { lineChart, barChart, donutChart, hbarChart, esc } from './charts.js';
import { fmtInt, fmt1, fmt2, pct, deltaLabel, sortableTable, sourceNote } from './format.js';

function kpiCard(ind) {
  return `<article class="kpi"><p class="kpi-label">${esc(ind.label)}</p>` +
    `<p class="kpi-value">${esc(ind.value)}</p>` +
    `<p class="kpi-change">${esc(ind.change)}</p>` +
    `<p class="kpi-source">${esc(ind.source)}</p></article>`;
}

function yearSelect(year) {
  return `<label class="ctl">Year <select id="year-select" aria-label="Select year">` +
    YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('') +
    `</select></label>`;
}

function sectionHead(title, blurb) {
  return `<div class="section-head"><h2>${esc(title)}</h2><p>${esc(blurb)}</p></div>`;
}

export function dashboardView(state) {
  const pop = rowFor(POPULATION, 2026);
  const eco = rowFor(ECONOMY, 2026);
  const emp = rowFor(EMPLOYMENT, 2026);
  const pri = rowFor(PRICES, 2026);
  const cards = KEY_INDICATORS.map(kpiCard).join('');
  const gdpSeries = ECONOMY.map((r) => ({ x: String(r.year), y: r.gdp }));
  const popSeries = POPULATION.map((r) => ({ x: String(r.year), y: r.total }));
  const cpiSeries = PRICES.map((r) => ({ x: String(r.year), y: r.cpi }));
  return `
  <section class="hero">
    <p class="eyebrow">Official statistics · ${esc(COUNTRY.fullName)}</p>
    <h1>Caldoria in numbers</h1>
    <p class="lede">The trusted figures behind every decision in Caldoria — population, the economy,
    jobs, prices and the regions, published by the National Statistical Office and updated every quarter.</p>
    <p class="hero-meta">Latest release: ${esc(COUNTRY.release)} · Next release: 12 January 2027</p>
    <div class="hero-links">
      <a class="btn" href="#/explorer">Explore all data</a>
      <a class="btn btn-ghost" href="#/methodology">How we measure</a>
    </div>
  </section>
  <section class="kpi-grid" aria-label="Key indicators 2026">${cards}</section>
  <div class="chart-grid">
    <section class="card">
      <h2>GDP, KM billion</h2>
      <p class="card-sub">Nominal GDP, 2016–2026. Caldoria's economy grew ${pct(eco.growth)} in real terms in 2026.</p>
      ${lineChart(gdpSeries, { label: 'GDP 2016 to 2026', format: (v) => 'KM ' + fmt1(v) + ' bn', color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, National accounts 2026')}
    </section>
    <section class="card">
      <h2>Inflation, % per year</h2>
      <p class="card-sub">Consumer prices rose ${pct(pri.cpi)} in 2026 — inside the 2–3% target band for a second year.</p>
      ${barChart(cpiSeries, { label: 'Annual CPI inflation 2016 to 2026', format: (v) => fmt1(v) + '%', color: '#0e6b6b' })}
      ${sourceNote('Caldoria Statistics, Consumer price index, September 2026')}
    </section>
  </div>
  <div class="chart-grid">
    <section class="card">
      <h2>Population, thousands</h2>
      <p class="card-sub">${fmtInt(pop.total)} thousand people on 1 January 2026; median age ${fmt1(pop.medianAge)} years.</p>
      ${lineChart(popSeries, { label: 'Population 2016 to 2026', format: (v) => fmtInt(v), color: '#4a7d5c' })}
      ${sourceNote('Caldoria Statistics, Population register')}
    </section>
    <section class="card">
      <h2>Where the economy comes from</h2>
      <p class="card-sub">Share of gross value added by sector, 2026. Services employ two in three Caldorians.</p>
      ${donutChart(SECTORS.map((s) => ({ label: s.sector, value: s.share })), { center: '62.4%', centerSub: 'services' })}
      ${sourceNote('Caldoria Statistics, National accounts 2026')}
    </section>
  </div>
  <section class="card">
    <h2>At a glance: 2026</h2>
    <p class="card-sub">Caldoria added ${fmtInt(pop.total - rowFor(POPULATION, 2025).total)} thousand people, real GDP rose ${pct(eco.growth)},
    unemployment fell to ${pct(emp.unemp)} and the average monthly wage reached KM ${fmtInt(emp.wage)}.
    Government debt fell to ${pct(eco.debt)} of GDP — its lowest since 2016.</p>
    <p><a href="#/population">Population in detail →</a> &nbsp; <a href="#/economy">Economy in detail →</a> &nbsp; <a href="#/regions">Compare regions →</a></p>
  </section>`;
}

export function populationView(state) {
  const year = state.year;
  const row = rowFor(POPULATION, year);
  const prev = rowFor(POPULATION, year - 1) || row;
  const series = POPULATION.map((r) => ({ x: String(r.year), y: r.total }));
  const age = AGE_GROUPS.map((a) => ({ label: a.group, value: a.share }));
  const rows = POPULATION.slice().reverse().map((r) => [
    String(r.year), fmtInt(r.total), fmt1(r.births), fmt1(r.deaths),
    fmt1(r.lifeExp), fmt1(r.medianAge), fmt1(r.urban) + '%',
  ]);
  return `
  ${sectionHead('Population', 'How many Caldorians there are, how long they live, and how the age structure is shifting.')}
  <div class="toolbar">${yearSelect(year)}<span class="toolbar-note">Showing ${year} — change the year to update every figure on this page.</span></div>
  <section class="kpi-grid">
    ${kpiCard({ label: 'Population', value: fmtInt(row.total) + ' thousand', change: deltaLabel(row.total, prev.total, ' thousand vs ' + (year - 1)), source: 'Population register, 1 Jan ' + year })}
    ${kpiCard({ label: 'Births per 1,000', value: fmt1(row.births), change: deltaLabel(row.births, prev.births, ' vs ' + (year - 1)), source: 'Vital statistics ' + year })}
    ${kpiCard({ label: 'Life expectancy', value: fmt1(row.lifeExp) + ' years', change: deltaLabel(row.lifeExp, prev.lifeExp, ' years vs ' + (year - 1)), source: 'Vital statistics ' + year })}
    ${kpiCard({ label: 'Urban share', value: fmt1(row.urban) + '%', change: deltaLabel(row.urban, prev.urban, ' pp vs ' + (year - 1)), source: 'Population register ' + year })}
  </section>
  <div class="chart-grid">
    <section class="card"><h2>Population, 2016–${year}</h2>
      <p class="card-sub">Caldoria's population has grown every year since 2016, by ${fmtInt(rowFor(POPULATION, 2026).total - rowFor(POPULATION, 2016).total)} thousand people in a decade.</p>
      ${lineChart(series, { label: 'Population 2016 to 2026', format: (v) => fmtInt(v), color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, Population register')}
    </section>
    <section class="card"><h2>Age structure, 2026</h2>
      <p class="card-sub">One Caldorian in five is 65 or older; the working-age share is 65.6%.</p>
      ${donutChart(age, { center: '18.6%', centerSub: 'aged 65+', palette: ['#14456b', '#0e6b6b', '#c98a1b', '#7a9bb5', '#4a7d5c'] })}
      ${sourceNote('Caldoria Statistics, Population by age, 1 Jan 2026')}
    </section>
  </div>
  <section class="card"><h2>Population by year</h2>
    ${sortableTable('pop-table',
      [{ key: 'year', label: 'Year', numeric: true }, { key: 'total', label: 'Population (thousands)', numeric: true },
       { key: 'births', label: 'Births / 1,000', numeric: true }, { key: 'deaths', label: 'Deaths / 1,000', numeric: true },
       { key: 'life', label: 'Life expectancy', numeric: true }, { key: 'age', label: 'Median age', numeric: true },
       { key: 'urban', label: 'Urban %', numeric: true }],
      rows, 'year', -1)}
    <p class="hint">Click any column heading to sort the table.</p>
    ${sourceNote('Caldoria Statistics, Population register and vital statistics, 2016–2026')}
  </section>`;
}

export function economyView(state) {
  const year = state.year;
  const row = rowFor(ECONOMY, year);
  const prev = rowFor(ECONOMY, year - 1) || row;
  const gdpSeries = ECONOMY.map((r) => ({ x: String(r.year), y: r.gdp }));
  const growthSeries = ECONOMY.map((r) => ({ x: String(r.year), y: r.growth, highlight: r.year === 2020 }));
  const tradeRows = TRADE_PARTNERS.map((t) => [t.partner, 'KM ' + fmt1(t.exports) + ' bn', 'KM ' + fmt1(t.imports) + ' bn', 'KM ' + fmt1(t.exports - t.imports) + ' bn']);
  return `
  ${sectionHead('Economy', 'GDP, growth, trade and public debt — the size of Caldoria\u2019s economy and where it is heading.')}
  <div class="toolbar">${yearSelect(year)}<span class="toolbar-note">Showing ${year}.</span></div>
  <section class="kpi-grid">
    ${kpiCard({ label: 'GDP (nominal)', value: 'KM ' + fmt1(row.gdp) + ' bn', change: deltaLabel(row.gdp, prev.gdp, ' bn vs ' + (year - 1)), source: 'National accounts ' + year })}
    ${kpiCard({ label: 'Real GDP growth', value: pct(row.growth), change: deltaLabel(row.growth, prev.growth, ' pp vs ' + (year - 1)), source: 'National accounts ' + year })}
    ${kpiCard({ label: 'GDP per capita', value: 'KM ' + fmtInt(row.perCapita), change: deltaLabel(row.perCapita, prev.perCapita, ' vs ' + (year - 1)), source: 'National accounts ' + year })}
    ${kpiCard({ label: 'Government debt', value: pct(row.debt) + ' of GDP', change: deltaLabel(row.debt, prev.debt, ' pp vs ' + (year - 1)), source: 'Public finance ' + year })}
  </section>
  <div class="chart-grid">
    <section class="card"><h2>GDP, KM billion</h2>
      <p class="card-sub">Nominal GDP more than doubled in a decade in current prices; the 2020 dip was the pandemic year.</p>
      ${lineChart(gdpSeries, { label: 'GDP 2016 to 2026', format: (v) => 'KM ' + fmt1(v) + ' bn', color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, National accounts 2026')}
    </section>
    <section class="card"><h2>Real growth, % per year</h2>
      <p class="card-sub">Growth returned to 2–3% after the 2021 rebound; 2020 is the only contraction in the series.</p>
      ${barChart(growthSeries, { label: 'Real GDP growth 2016 to 2026', format: (v) => fmt1(v) + '%', color: '#0e6b6b' })}
      ${sourceNote('Caldoria Statistics, National accounts 2026')}
    </section>
  </div>
  <section class="card"><h2>Trade in ${year}</h2>
    <p class="card-sub">Caldoria exported KM ${fmt1(row.exports)} bn and imported KM ${fmt1(row.imports)} bn in ${year} — a deficit of KM ${fmt1(row.imports - row.exports)} bn.</p>
    ${sortableTable('trade-table',
      [{ key: 'partner', label: 'Partner' }, { key: 'exports', label: 'Exports', numeric: true },
       { key: 'imports', label: 'Imports', numeric: true }, { key: 'balance', label: 'Balance', numeric: true }],
      tradeRows, 'partner', 1)}
    ${sourceNote('Caldoria Statistics, Foreign trade statistics 2026')}
  </section>`;
}

export function employmentView(state) {
  const year = state.year;
  const row = rowFor(EMPLOYMENT, year);
  const prev = rowFor(EMPLOYMENT, year - 1) || row;
  const unempSeries = EMPLOYMENT.map((r) => ({ x: String(r.year), y: r.unemp }));
  const wageSeries = EMPLOYMENT.map((r) => ({ x: String(r.year), y: r.wage }));
  const youthSeries = EMPLOYMENT.map((r) => ({ x: String(r.year), y: r.youthUnemp }));
  return `
  ${sectionHead('Employment', 'Who works, who is looking for work, and what Caldorians earn.')}
  <div class="toolbar">${yearSelect(year)}<span class="toolbar-note">Showing ${year}.</span></div>
  <section class="kpi-grid">
    ${kpiCard({ label: 'Unemployment rate', value: pct(row.unemp), change: deltaLabel(row.unemp, prev.unemp, ' pp vs ' + (year - 1)), source: 'Labour force survey ' + year })}
    ${kpiCard({ label: 'Employment rate', value: pct(row.empRate), change: deltaLabel(row.empRate, prev.empRate, ' pp vs ' + (year - 1)), source: 'Labour force survey ' + year })}
    ${kpiCard({ label: 'Average monthly wage', value: 'KM ' + fmtInt(row.wage), change: deltaLabel(row.wage, prev.wage, ' vs ' + (year - 1)), source: 'Earnings survey ' + year })}
    ${kpiCard({ label: 'Youth unemployment', value: pct(row.youthUnemp), change: deltaLabel(row.youthUnemp, prev.youthUnemp, ' pp vs ' + (year - 1)), source: 'Labour force survey ' + year })}
  </section>
  <div class="chart-grid">
    <section class="card"><h2>Unemployment, %</h2>
      <p class="card-sub">Unemployment is at its lowest since the series began, down from 7.9% in the pandemic year 2020.</p>
      ${lineChart(unempSeries, { label: 'Unemployment rate 2016 to 2026', format: (v) => fmt1(v) + '%', color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, Labour force survey')}
    </section>
    <section class="card"><h2>Average monthly wage, KM</h2>
      <p class="card-sub">Wages rose 5.2% in 2026 — faster than prices for the third year running, so real pay is up.</p>
      ${lineChart(wageSeries, { label: 'Average monthly wage 2016 to 2026', format: (v) => 'KM ' + fmtInt(v), color: '#c98a1b' })}
      ${sourceNote('Caldoria Statistics, Earnings survey')}
    </section>
  </div>
  <section class="card"><h2>Youth unemployment, %</h2>
    <p class="card-sub">Unemployment among 15–24 year olds fell to ${pct(row.youthUnemp)} in ${year}, from a 17.8% peak in 2020.</p>
    ${barChart(youthSeries, { label: 'Youth unemployment 2016 to 2026', format: (v) => fmt1(v) + '%', color: '#4a7d5c' })}
    ${sourceNote('Caldoria Statistics, Labour force survey')}
  </section>`;
}

export function pricesView(state) {
  const year = state.year;
  const row = rowFor(PRICES, year);
  const prev = rowFor(PRICES, year - 1) || row;
  const cpiSeries = PRICES.map((r) => ({ x: String(r.year), y: r.cpi, highlight: r.year === 2022 }));
  const indexSeries = PRICES.map((r) => ({ x: String(r.year), y: r.index }));
  const basket = [
    ['Food and non-alcoholic drinks', fmt1(row.food) + '%', 'Bread +2.1%, milk +1.8%, fresh vegetables +3.4%'],
    ['Housing, water and energy', fmt1(row.housing) + '%', 'Rents +2.2%, electricity +3.1%'],
    ['Transport', fmt1(row.transport) + '%', 'Fuel +1.4%, public transport +2.6%'],
    ['Health', '2.0%', 'Medicines +1.6%, dental care +2.9%'],
    ['Education', '1.7%', 'School fees +1.5%, books +2.2%'],
    ['Recreation and culture', '2.4%', 'Streaming +3.0%, sports +1.9%'],
  ];
  return `
  ${sectionHead('Prices & inflation', 'What things cost, how fast prices rise, and which parts of the basket move most.')}
  <div class="toolbar">${yearSelect(year)}<span class="toolbar-note">Showing ${year}.</span></div>
  <section class="kpi-grid">
    ${kpiCard({ label: 'CPI inflation', value: pct(row.cpi), change: deltaLabel(row.cpi, prev.cpi, ' pp vs ' + (year - 1)), source: 'Consumer price index ' + year })}
    ${kpiCard({ label: 'CPI index (2016 = 100)', value: fmt1(row.index), change: deltaLabel(row.index, prev.index, ' points vs ' + (year - 1)), source: 'Consumer price index ' + year })}
    ${kpiCard({ label: 'Food inflation', value: pct(row.food), change: deltaLabel(row.food, prev.food, ' pp vs ' + (year - 1)), source: 'Consumer price index ' + year })}
    ${kpiCard({ label: 'Housing inflation', value: pct(row.housing), change: deltaLabel(row.housing, prev.housing, ' pp vs ' + (year - 1)), source: 'Consumer price index ' + year })}
  </section>
  <div class="chart-grid">
    <section class="card"><h2>Annual inflation, %</h2>
      <p class="card-sub">The 2022 spike to 6.8% was the highest in the series; inflation has been inside the 2–3% target band since 2024.</p>
      ${barChart(cpiSeries, { label: 'Annual inflation 2016 to 2026', format: (v) => fmt1(v) + '%', color: '#0e6b6b' })}
      ${sourceNote('Caldoria Statistics, Consumer price index')}
    </section>
    <section class="card"><h2>Price level, 2016 = 100</h2>
      <p class="card-sub">Prices in 2026 are 33.0% above their 2016 level — a basket that cost KM 100 then costs KM 133.00 now.</p>
      ${lineChart(indexSeries, { label: 'CPI index 2016 to 2026', format: (v) => fmt1(v), color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, Consumer price index')}
    </section>
  </div>
  <section class="card"><h2>The ${year} basket, by group</h2>
    ${sortableTable('basket-table',
      [{ key: 'group', label: 'Group' }, { key: 'change', label: 'Annual change', numeric: true }, { key: 'detail', label: 'What moved' }],
      basket, 'group', 1)}
    <p class="hint">Prices are collected monthly in 42 towns from 1,850 outlets and 12,400 price quotes.</p>
    ${sourceNote('Caldoria Statistics, Consumer price index, methodology note 2026')}
  </section>`;
}

export function regionsView(state) {
  const sortKey = state.regionSort || 'pop';
  const sortDir = state.regionDir || -1;
  const gdpOf = (r) => (r.pop * r.gdpPc) / 1000000;
  const sorted = REGIONS.slice().sort((a, b) => {
    if (sortKey === 'name') return (a.name < b.name ? -1 : 1) * sortDir;
    const av = sortKey === 'gdp' ? gdpOf(a) : a[sortKey];
    const bv = sortKey === 'gdp' ? gdpOf(b) : b[sortKey];
    return (av - bv) * sortDir;
  });
  const rows = sorted.map((r) => [
    r.name, fmtInt(r.pop), 'KM ' + fmtInt(r.gdpPc), pct(r.unemp), fmtInt(r.area),
    'KM ' + fmt1((r.pop * r.gdpPc) / 1000000) + ' bn',
  ]);
  const byPop = REGIONS.slice().sort((a, b) => b.pop - a.pop).map((r) => ({ label: r.name, value: r.pop }));
  const byGdp = REGIONS.slice().sort((a, b) => b.gdpPc - a.gdpPc).map((r) => ({ label: r.name, value: r.gdpPc }));
  return `
  ${sectionHead('Regions', 'Caldoria has eight regions. Velmara Capital is the richest and most populous; Highland North is the smallest and poorest.')}
  <div class="chart-grid">
    <section class="card"><h2>Population by region, thousands</h2>
      <p class="card-sub">Velmara Capital holds 21.9% of all Caldorians; the Island of Mirell holds 5.5%.</p>
      ${hbarChart(byPop, { format: (v) => fmtInt(v) })}
      ${sourceNote('Caldoria Statistics, Regional population 2026')}
    </section>
    <section class="card"><h2>GDP per capita by region, KM</h2>
      <p class="card-sub">The capital's output per person is 2.2 times Highland North's — the widest gap in the country.</p>
      ${hbarChart(byGdp, { format: (v) => 'KM ' + fmtInt(v), color: '#14456b' })}
      ${sourceNote('Caldoria Statistics, Regional accounts 2026')}
    </section>
  </div>
  <section class="card"><h2>All regions, 2026</h2>
    <p class="card-sub">Regional GDP is population × GDP per capita. Click a heading to sort.</p>
    <div id="region-table-wrap">${sortableTable('region-table',
      [{ key: 'name', label: 'Region' }, { key: 'pop', label: 'Population (thousands)', numeric: true },
       { key: 'gdpPc', label: 'GDP per capita', numeric: true }, { key: 'unemp', label: 'Unemployment', numeric: true },
       { key: 'area', label: 'Area (km²)', numeric: true }, { key: 'gdp', label: 'Regional GDP', numeric: true }],
      rows, sortKey, sortDir)}</div>
    ${sourceNote('Caldoria Statistics, Regional accounts and labour force survey 2026')}
  </section>`;
}

export function explorerView(state) {
  const q = (state.query || '').toLowerCase();
  const all = [];
  YEARS.forEach((y) => {
    const p = rowFor(POPULATION, y), e = rowFor(ECONOMY, y), m = rowFor(EMPLOYMENT, y), c = rowFor(PRICES, y);
    all.push(
      { year: y, indicator: 'Population (thousands)', value: fmtInt(p.total), topic: 'Population' },
      { year: y, indicator: 'GDP (KM bn)', value: fmt1(e.gdp), topic: 'Economy' },
      { year: y, indicator: 'Real GDP growth (%)', value: fmt1(e.growth), topic: 'Economy' },
      { year: y, indicator: 'Unemployment (%)', value: fmt1(m.unemp), topic: 'Employment' },
      { year: y, indicator: 'Average monthly wage (KM)', value: fmtInt(m.wage), topic: 'Employment' },
      { year: y, indicator: 'CPI inflation (%)', value: fmt1(c.cpi), topic: 'Prices' },
      { year: y, indicator: 'Life expectancy (years)', value: fmt1(p.lifeExp), topic: 'Population' },
    );
  });
  const filtered = all.filter((r) =>
    (!q || r.indicator.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q)) &&
    (!state.topic || state.topic === 'All' || r.topic === state.topic) &&
    (!state.yearFilter || r.year === state.yearFilter));
  const shown = filtered.slice(0, 60);
  const topics = ['All', 'Population', 'Economy', 'Employment', 'Prices'];
  return `
  ${sectionHead('Data explorer', 'Every headline figure, 2016–2026, in one searchable table. Type to filter, pick a topic, or pick a year.')}
  <div class="toolbar explorer-bar">
    <label class="ctl">Search <input id="explorer-search" type="search" placeholder="e.g. unemployment" value="${esc(state.query || '')}" aria-label="Search indicators"></label>
    <label class="ctl">Topic <select id="explorer-topic">${topics.map((t) => `<option${t === (state.topic || 'All') ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
    <label class="ctl">Year <select id="explorer-year"><option value="">All years</option>${YEARS.map((y) => `<option value="${y}"${state.yearFilter === y ? ' selected' : ''}>${y}</option>`).join('')}</select></label>
    <button class="btn btn-small" id="explorer-csv" type="button">Download CSV</button>
  </div>
  <section class="card"><h2>Results — ${filtered.length} rows${filtered.length > 60 ? ' (first 60 shown)' : ''}</h2>
    ${sortableTable('explorer-table',
      [{ key: 'year', label: 'Year', numeric: true }, { key: 'topic', label: 'Topic' },
       { key: 'indicator', label: 'Indicator' }, { key: 'value', label: 'Value', numeric: true }],
      shown.map((r) => [String(r.year), r.topic, r.indicator, r.value]), 'year', -1)}
    <p class="hint">CSV download saves exactly the rows you have filtered — no account, no sign-up.</p>
    ${sourceNote('Caldoria Statistics, Statistical Yearbook 2026 — all series, 2016–2026')}
  </section>`;
}

export function methodologyView() {
  return `
  ${sectionHead('Methodology', 'How Caldoria\u2019s statistics are made, so you can judge them for yourself.')}
  <section class="card prose">
    <h2>Where the numbers come from</h2>
    <p>Population figures come from the population register, updated daily from births, deaths and
    migration records, and frozen on 1 January each year. Economic figures come from the national
    accounts, compiled from tax records, company surveys and customs data under the Caldorian System
    of National Accounts (CSNA 2018). Labour figures come from the quarterly labour force survey of
    24,000 households. Prices come from 12,400 monthly price quotes in 1,850 outlets across 42 towns.</p>
    <h2>Revisions</h2>
    <p>National accounts are revised twice: a first estimate 45 days after the quarter ends, and a
    final figure with the annual yearbook. Revisions larger than 0.3 percentage points are flagged
    in the release notes. The 2026 figures on this site are final except Q3 trade, marked provisional (p).</p>
    <h2>Quality and independence</h2>
    <p>Caldoria Statistics is independent of government by the Statistics Act 2019. No minister sees
    a release before publication. Every release carries its source, its sample size and its revision
    history, and the full yearbook tables are free to download from the data explorer.</p>
    <h2>Contact</h2>
    <p>Questions about a figure: write to <strong>figures@caldoria-stats.example</strong> (a demonstration
    address for this site) or call the statistics helpline, weekdays 09:00–16:00. Press enquiries use the
    same address with “PRESS” in the subject line.</p>
    <h2>Release calendar</h2>
    <ul>
      <li>12 January 2027 — Labour force survey, Q4 2026</li>
      <li>9 February 2027 — Consumer prices, January 2027</li>
      <li>2 March 2027 — National accounts, Q4 2026</li>
      <li>14 April 2027 — Population, 1 January 2027</li>
    </ul>
    ${sourceNote('Caldoria Statistics, Quality declaration 2026')}
  </section>`;
}

export const VIEWS = {
  '/': dashboardView,
  '/population': populationView,
  '/economy': economyView,
  '/employment': employmentView,
  '/prices': pricesView,
  '/regions': regionsView,
  '/explorer': explorerView,
  '/methodology': methodologyView,
};
