# Waka Quest · status

De statuspagina van Waka Quest, los van de app: GitHub Pages in plaats van Firebase, zodat hij werkt als de app of de
hosting hapert. Adres: **status.waka-quest.com** (het oude github.io-adres stuurt daarheen door). De app leest
`status.json` en `data/state.json` rechtstreeks via raw.githubusercontent.com, zodat de balk in de app ook werkt als
waka-quest.com zelf hapert.

## Wat er vanzelf gebeurt

- Elke 10 minuten (op :07, :17, …) bezoekt `.github/workflows/check.yml` de adressen in `checks.json` (`scripts/check.mjs`).
- Werkt een adres twee keer achter elkaar niet, dan opent hij een **issue "Storing: …"**. GitHub mailt dat en stuurt een
  pushbericht via de GitHub-app. Werkt het weer, dan sluit hij het issue zelf.
- De resultaten staan in `data/state.json` (nu) en `data/days.json` (per dag, 90 dagen). De pagina leest die.
- Alleen de eigen, kortlevende sleutel van GitHub; geen eigen sleutels, geen code van anderen, geen persoonsgegevens.

## Zelf een melding zetten: `status.json`

Pas `status.json` aan (op github.com: het potloodje, dan "Commit changes"). De pagina toont het binnen 2 minuten; de app leest hetzelfde bestand
(vanaf stap 3).

- `"mode"`: `"ok"`, `"incident"` (storing) of `"maintenance"` (onderhoud nu).
- `"message"`: de korte tekst per taal (`nl`, `en`, `es`, `fr`, `pt` = Braziliaans, `zh`).
- `"maintenance"`: gepland onderhoud, bijvoorbeeld:
  `{ "from": "2026-11-02T05:00:00-03:00", "until": "2026-11-02T06:00:00-03:00", "message": { "nl": "…", "en": "…" } }`
  Tijdens dat venster staat de pagina vanzelf op onderhoud; ervoor staat het onder "Gepland onderhoud".
- `"history"`: eerdere meldingen, bijvoorbeeld:
  `{ "date": "2026-10-14", "title": { "nl": "…" }, "text": { "nl": "…" } }`
- Zet `"updated"` op de tijd van je wijziging. Klaar? `"mode"` terug op `"ok"` en de melding in `"history"`.

Ontbreekt een taal, dan toont de pagina Engels, en anders Nederlands. Claude vertaalt de teksten graag.

## Contact

info@waka-quest.com · chat via waka-quest.com/links (geen telefoonnummer als tekst).

## Het wekkertje (Cloudflare Worker)

GitHub start geplande rondes maar af en toe. Daarom start een Cloudflare Worker (`worker/index.js`, naam
`waka-status-cron`) de controles elke 10 minuten zelf. Hij gebruikt een GitHub-sleutel (fine-grained token) die alleen
voor deze repository geldt en alleen "Actions: read and write" mag. De sleutel staat als geheim `GH_TOKEN` in
Cloudflare (Settings > Variables and Secrets), nergens in deze repository.

- Werkt het niet meer? Kijk in Cloudflare bij de Worker > Logs: "401/403" betekent dat de sleutel verlopen is.
- Sleutel vernieuwen: GitHub > Settings > Developer settings > Fine-grained tokens > Regenerate, en de nieuwe waarde
  in Cloudflare bij `GH_TOKEN` plakken.
