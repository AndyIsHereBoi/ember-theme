# Ember — Release Notes

A user-facing theme for the Calagopus Panel. Frontend only: styling lives in
`frontend/src/app.css`, plus a small script that tags the document so the admin
area can be excluded. No backend routes, no database migrations.

---

## 1.0.4

### Power buttons (console + sidebar)

- **Start** is now Ember orange (`#f38838`) instead of the stock green, with the
  old panel's `#eff6ff` label.
- **Stop** uses the old panel's `#dc2626` red; **Restart** uses its flat
  `#1e202d` "text button" look.
- Disabled states no longer fall back to Mantine's neutral grey: a running Start
  becomes a translucent orange wash (`rgba(243,136,56,.6)`), a disabled Stop a
  translucent red (`rgba(224,49,49,.6)`).
- Typography matched to the old panel's button module: 14px, weight 600,
  1.25 line-height, `0.1em` letter-spacing, 40px tall.
- The three buttons share an equal width (`6.25rem` floor) on desktop only
  (`min-width: 48em`); mobile keeps the shrink-to-fit row.

## 1.0.3

- **Fonts are bundled with the extension.** Inter (latin + latin-ext, variable
  400–700) now ships in `frontend/public/ember/` and is served same-origin from
  `/ember/…`. The panel sends `Content-Security-Policy: font-src 'self'`, which
  silently blocked the previous `fonts.gstatic.com` URLs on real panels and made
  the theme fall back to Helvetica — the dev server has no CSP, so it only
  showed up in production. Also makes the theme work offline.
- Removed the leftover `mypublicfile.txt` template placeholder.

## 1.0.2

- **Fixed Chromium/Edge rendering.** The text-rasterisation hints
  (`text-rendering: optimizeSpeed`, `font-kerning: none`,
  `font-optical-sizing: none`) are now wrapped in `@supports (-moz-appearance:
  none)`, so only Gecko applies them. Chromium honours kerning/optical-sizing
  but ignores `optimizeSpeed`, which left its text looking stretched.
- Firefox keeps the sharper rendering.

## 1.0.1

- `panel_version` requirement lowered from `>=1.2.8` to `>=1.2.7`.
- No visual changes.

## 1.0.0

Initial release.

### Palette

- Ember orange `#f38838` applied panel-wide (client **and** admin) by remapping
  Mantine's `blue` ramp and its derived `filled` / `light` / `outline` / `text` /
  `anchor` tokens, per colour scheme. Covers checkboxes, switches, radios, tabs,
  selected rows, progress bars, pagination, links and default buttons.

### Page surfaces

- Dark: page `#121422`, cards/inputs `#1e202d`, borders `#2b3044`, text
  `#f8fafc`, dimmed `#cbd5e1` (the old panel's slab palette).
- Light: page `#e9edf4`, cards `#f8fafc`, inset inputs `#f1f5f9`, borders
  `#cfd8e3`, text `#0f172a` — layered so the page sits below the cards instead of
  everything reading as flat white.
- Typography: Inter for body and headings (the old panel's `font-sans`), replacing
  the panel's Helvetica stack.

### Sidebar (client only)

- Docked to the left edge: no margin, full viewport height, square corners, a
  single right-hand divider instead of a floating rounded card.
- Slate rail `#0f172a` in both colour schemes; the rail re-declares the dark
  palette locally so start/stop buttons, switchers and menus look identical in
  light mode.
- Nav entries: flat full-width rows, no pill backgrounds, 1rem Inter labels,
  animated orange dot + bold + indent on the selected entry.
- Dividers use dimmed uppercase micro-caps; the account card is a dark panel.
- Mobile: the drawer mirrors the desktop rail, with an orange close button.

### Charts

- Single-series charts (CPU load, memory load, disk) use Ember orange; charts
  with more than one series (network in/out, tunnel directions) keep the stock
  colours.
- The "limit above visible range" badge is lifted clear of the top gridline so it
  lines up with the y-axis ticks.

---

## Scope notes

- `/admin` keeps the stock sidebar and typography; it only receives the orange
  palette.
- Scoping is done by `routeScope.ts`, which sets `<html data-ember-scope="client|admin">`
  and hooks `history.pushState` / `replaceState` + `popstate` so client-side
  navigation keeps it in sync.
