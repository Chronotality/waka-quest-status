# Waka Quest · status

De statuspagina van Waka Quest, los van de app: GitHub Pages in plaats van Firebase, zodat hij werkt als de app of de
hosting hapert. Adres: status.waka-quest.com (na de DNS-regel) en als reserve chronotality.github.io/waka-quest-status.

## Wat er vanzelf gebeurt

- Elke 10 minuten bezoekt `.github/workflows/check.yml` de adressen in `checks.json` (`scripts/check.mjs`).
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
