// Caldoria national statistics — one coherent invented dataset.
// Every figure on the site comes from here, so pages agree with each other.
// Years 2016-2026. Currency: Caldorian mark (KM), shown as $ for readability
// only in the trade table; GDP is in KM billions. Source line on every page:
// "Caldoria Statistics, National Statistical Office — release 2026-Q3".

export const COUNTRY = {
  name: 'Caldoria',
  fullName: 'Republic of Caldoria',
  capital: 'Velmara',
  population2026: 8420000,
  areaKm2: 68400,
  currency: 'Caldorian mark (KM)',
  office: 'Caldoria Statistics',
  officeShort: 'CALSTAT',
  release: 'Statistical Yearbook 2026 · Release 2026-Q3 · Published 14 October 2026',
};

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// Population in thousands, births/deaths per 1,000, life expectancy in years.
export const POPULATION = [
  { year: 2016, total: 7912, births: 11.4, deaths: 9.8, lifeExp: 78.1, medianAge: 38.9, urban: 61.2 },
  { year: 2017, total: 7978, births: 11.2, deaths: 9.7, lifeExp: 78.4, medianAge: 39.2, urban: 61.8 },
  { year: 2018, total: 8041, births: 11.0, deaths: 9.6, lifeExp: 78.6, medianAge: 39.5, urban: 62.4 },
  { year: 2019, total: 8105, births: 10.9, deaths: 9.5, lifeExp: 78.9, medianAge: 39.8, urban: 63.0 },
  { year: 2020, total: 8122, births: 10.4, deaths: 10.6, lifeExp: 78.2, medianAge: 40.1, urban: 63.4 },
  { year: 2021, total: 8168, births: 10.6, deaths: 10.1, lifeExp: 78.5, medianAge: 40.4, urban: 63.9 },
  { year: 2022, total: 8244, births: 10.8, deaths: 9.7, lifeExp: 79.0, medianAge: 40.6, urban: 64.5 },
  { year: 2023, total: 8310, births: 10.7, deaths: 9.5, lifeExp: 79.3, medianAge: 40.8, urban: 65.1 },
  { year: 2024, total: 8366, births: 10.5, deaths: 9.4, lifeExp: 79.6, medianAge: 41.0, urban: 65.6 },
  { year: 2025, total: 8394, births: 10.3, deaths: 9.3, lifeExp: 79.8, medianAge: 41.2, urban: 66.0 },
  { year: 2026, total: 8420, births: 10.2, deaths: 9.2, lifeExp: 80.0, medianAge: 41.4, urban: 66.4 },
];

// Age structure 2026, percent of population.
export const AGE_GROUPS = [
  { group: '0–14', share: 15.8 },
  { group: '15–24', share: 11.6 },
  { group: '25–44', share: 27.9 },
  { group: '45–64', share: 26.1 },
  { group: '65+', share: 18.6 },
];

// GDP in KM billion (nominal), real growth %, GDP per capita KM, government debt % of GDP.
export const ECONOMY = [
  { year: 2016, gdp: 148.2, growth: 2.1, perCapita: 18730, debt: 54.2, exports: 52.1, imports: 55.8 },
  { year: 2017, gdp: 156.4, growth: 2.8, perCapita: 19600, debt: 53.1, exports: 55.4, imports: 58.2 },
  { year: 2018, gdp: 164.9, growth: 3.1, perCapita: 20510, debt: 51.8, exports: 59.0, imports: 61.5 },
  { year: 2019, gdp: 172.3, growth: 2.6, perCapita: 21260, debt: 50.4, exports: 61.2, imports: 63.1 },
  { year: 2020, gdp: 161.8, growth: -4.2, perCapita: 19920, debt: 58.9, exports: 54.7, imports: 57.9 },
  { year: 2021, gdp: 178.5, growth: 5.4, perCapita: 21850, debt: 56.3, exports: 63.8, imports: 66.4 },
  { year: 2022, gdp: 193.7, growth: 3.9, perCapita: 23500, debt: 53.7, exports: 70.1, imports: 73.2 },
  { year: 2023, gdp: 201.4, growth: 2.2, perCapita: 24240, debt: 51.9, exports: 72.6, imports: 74.8 },
  { year: 2024, gdp: 208.9, growth: 2.7, perCapita: 24970, debt: 50.2, exports: 75.9, imports: 77.6 },
  { year: 2025, gdp: 214.6, growth: 2.4, perCapita: 25570, debt: 48.8, exports: 78.4, imports: 79.9 },
  { year: 2026, gdp: 221.3, growth: 2.9, perCapita: 26280, debt: 47.5, exports: 81.2, imports: 82.6 },
];

// GDP by sector, 2026, % of gross value added.
export const SECTORS = [
  { sector: 'Services', share: 62.4 },
  { sector: 'Industry', share: 24.1 },
  { sector: 'Agriculture', share: 4.8 },
  { sector: 'Construction', share: 6.2 },
  { sector: 'Energy & mining', share: 2.5 },
];

// Labour market: unemployment %, employment rate %, average monthly wage KM, youth unemployment %.
export const EMPLOYMENT = [
  { year: 2016, unemp: 6.8, empRate: 68.4, wage: 2840, youthUnemp: 14.2 },
  { year: 2017, unemp: 6.2, empRate: 69.1, wage: 2960, youthUnemp: 13.1 },
  { year: 2018, unemp: 5.7, empRate: 69.8, wage: 3110, youthUnemp: 12.4 },
  { year: 2019, unemp: 5.1, empRate: 70.6, wage: 3280, youthUnemp: 11.3 },
  { year: 2020, unemp: 7.9, empRate: 67.2, wage: 3310, youthUnemp: 17.8 },
  { year: 2021, unemp: 6.4, empRate: 69.0, wage: 3470, youthUnemp: 14.6 },
  { year: 2022, unemp: 5.3, empRate: 70.4, wage: 3690, youthUnemp: 12.1 },
  { year: 2023, unemp: 4.8, empRate: 71.2, wage: 3880, youthUnemp: 11.0 },
  { year: 2024, unemp: 4.4, empRate: 71.8, wage: 4070, youthUnemp: 10.2 },
  { year: 2025, unemp: 4.2, empRate: 72.1, wage: 4260, youthUnemp: 9.6 },
  { year: 2026, unemp: 4.1, empRate: 72.4, wage: 4480, youthUnemp: 9.1 },
];

// CPI: annual inflation %, index 2016 = 100, food, housing, transport sub-indices (annual %).
export const PRICES = [
  { year: 2016, cpi: 1.8, index: 100.0, food: 1.2, housing: 2.4, transport: 1.5 },
  { year: 2017, cpi: 2.1, index: 102.1, food: 1.9, housing: 2.6, transport: 2.0 },
  { year: 2018, cpi: 2.4, index: 104.6, food: 2.2, housing: 2.9, transport: 2.6 },
  { year: 2019, cpi: 1.9, index: 106.6, food: 1.6, housing: 2.3, transport: 1.4 },
  { year: 2020, cpi: 0.9, index: 107.5, food: 2.8, housing: 1.1, transport: -1.8 },
  { year: 2021, cpi: 3.2, index: 111.0, food: 3.9, housing: 2.8, transport: 5.1 },
  { year: 2022, cpi: 6.8, index: 118.5, food: 8.4, housing: 5.2, transport: 9.7 },
  { year: 2023, cpi: 4.1, index: 123.4, food: 5.0, housing: 4.4, transport: 2.9 },
  { year: 2024, cpi: 2.8, index: 126.8, food: 3.1, housing: 3.0, transport: 1.8 },
  { year: 2025, cpi: 2.5, index: 130.0, food: 2.7, housing: 2.6, transport: 2.2 },
  { year: 2026, cpi: 2.3, index: 133.0, food: 2.4, housing: 2.5, transport: 2.0 },
];

// Regions, 2026: population (thousands), GDP per capita KM, unemployment %.
export const REGIONS = [
  { name: 'Velmara Capital', pop: 1840, gdpPc: 38400, unemp: 3.4, area: 1240 },
  { name: 'North Coast', pop: 1210, gdpPc: 27900, unemp: 3.9, area: 9800 },
  { name: 'Harbour East', pop: 1060, gdpPc: 26300, unemp: 4.2, area: 7600 },
  { name: 'Central Plains', pop: 1480, gdpPc: 23100, unemp: 4.0, area: 15400 },
  { name: 'Southern Hills', pop: 940, gdpPc: 19800, unemp: 5.1, area: 11200 },
  { name: 'Western Valleys', pop: 820, gdpPc: 21400, unemp: 4.6, area: 13600 },
  { name: 'Highland North', pop: 610, gdpPc: 17600, unemp: 5.8, area: 8300 },
  { name: 'Island of Mirell', pop: 460, gdpPc: 24200, unemp: 4.4, area: 2260 },
];

// Top trading partners 2026, KM billion.
export const TRADE_PARTNERS = [
  { partner: 'Nordmark', exports: 14.6, imports: 13.9 },
  { partner: 'Alberia', exports: 11.8, imports: 12.4 },
  { partner: 'Tessin Republic', exports: 9.2, imports: 8.7 },
  { partner: 'Ostara', exports: 7.5, imports: 9.1 },
  { partner: 'Kavaria', exports: 6.1, imports: 5.8 },
  { partner: 'Meridia', exports: 5.4, imports: 6.2 },
];

// Key indicators shown on the dashboard, each with a source note.
export const KEY_INDICATORS = [
  { id: 'pop', label: 'Population', value: '8.42 million', change: '+0.31% vs 2025', source: 'Population register, 1 Jan 2026' },
  { id: 'gdp', label: 'GDP', value: 'KM 221.3 bn', change: '+2.9% real growth', source: 'National accounts, 2026' },
  { id: 'gdpPc', label: 'GDP per capita', value: 'KM 26,280', change: '+2.8% vs 2025', source: 'National accounts, 2026' },
  { id: 'unemp', label: 'Unemployment', value: '4.1%', change: '−0.1 pp vs 2025', source: 'Labour force survey, Q3 2026' },
  { id: 'cpi', label: 'Inflation (CPI)', value: '2.3%', change: '−0.2 pp vs 2025', source: 'Consumer prices, Sep 2026' },
  { id: 'wage', label: 'Average monthly wage', value: 'KM 4,480', change: '+5.2% vs 2025', source: 'Earnings survey, Q2 2026' },
  { id: 'life', label: 'Life expectancy', value: '80.0 years', change: '+0.2 vs 2025', source: 'Vital statistics, 2026' },
  { id: 'debt', label: 'Government debt', value: '47.5% of GDP', change: '−1.3 pp vs 2025', source: 'Public finance, 2026' },
];

export function rowFor(table, year) {
  return table.find((r) => r.year === year) || table[table.length - 1];
}
