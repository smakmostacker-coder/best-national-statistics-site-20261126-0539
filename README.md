# Caldoria Statistics — National Statistics Office

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/smakmostacker-coder/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/smakmostacker-coder/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

The official statistics site for the **Republic of Caldoria** — a fictional country with a
fully coherent invented dataset. The overview dashboard leads with eight key indicators for
2026 (population 8.42 million, GDP KM 221.3 billion, unemployment 4.1%, inflation 2.3%),
and every section is a working page reached by a link: Population (year selector, age-structure
donut, sortable 2016–2026 table), Economy (GDP and growth charts, trade by partner), Employment
(unemployment, wages, youth unemployment), Prices & inflation (CPI charts and the price basket),
Regions (population and GDP-per-capita bars plus a sortable table for all eight regions),
a Data explorer (search, topic and year filters, CSV download of the filtered rows) and a
Methodology page (sources, revisions, release calendar). Charts are hand-drawn SVG from the
site's own code; every figure carries its source and year, and the numbers agree across pages
because they all come from one dataset in `app/data.js`. The site is static files only — no
build step, no network requests, and it works on a phone.

## Serve it

```sh
node serve.ts
# then open http://localhost:8080 (use --port <n> for another port)
```

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output`
and writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
