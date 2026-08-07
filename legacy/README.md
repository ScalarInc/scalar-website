# Helios — phobos.com.au design recreation

A static site that recreates the layout, design system and interactions of
[phobos.com.au](https://www.phobos.com.au/), rebuilt from scratch.

All copy is original, and all artwork is generated SVG. Phobos's own text,
photography, logo, client trademarks and contact details are **not** reproduced —
the brand here is a placeholder called "Helios".

## Run it

Any static server works. From this directory:

```sh
python -m http.server 8811
```

Then open <http://127.0.0.1:8811/>.

Opening `index.html` directly from disk also works, though a server is closer to
production behaviour.

## Files

```
index.html          Homepage — hero, expertise, approach, statement,
                    case studies, insights, careers, clients, CTA
expertise.html      Discipline tiles + engagement model
about.html          Studio, principles, certification
case-studies.html   Full case-study grid
insights.html       Article grid
contact.html        Details + demo form (no backend)

assets/css/style.css   Design tokens, components, layout, responsive rules
assets/js/main.js      Header state, nav overlay, scroll reveal,
                       accordion, hero particle globe
assets/img/*.svg       Generated abstract artwork (placeholder imagery)
```

## Design system

| Token | Value | Used for |
| --- | --- | --- |
| `--charcoal` | `#1c1c1c` | Hero, sticky header, nav overlay |
| `--forest` | `#1e2d1f` | Footer, clients band, dark cards |
| `--orchid` | `#c98cc4` | Accent — wordmark, headline, markers |
| `--lilac` | `#ecdcee` | Card panels |
| `--khaki` | `#b4af95` | Card panels |
| `--cream` | `#efeae1` | Alternating section background |

Type is a three-way split: a neo-grotesque for display (Inter, falling back to
Helvetica Neue/Arial), a grotesque mono for eyebrows, chips and technical
readouts (JetBrains Mono), and a squarish techno face for the wordmark
(Orbitron). Webfonts load from Google Fonts; system fallbacks cover offline use.

## Notable implementation details

- **Hero globe** (`main.js`) — a Fibonacci-sphere point cloud rendered to canvas,
  rotated and tilted per frame, with a steep depth falloff so it reads as a lit
  shell rather than a flat disc. Four dotted orbit rings sit behind it, and three
  crosshair markers report angular position in degrees and radians. Markers
  oscillate within a narrow arc of the lower hemisphere so their readouts never
  drift under the headline, and are omitted entirely below 860px.
- **Colour strip** — five panels that scale up from their baseline on a staggered
  delay when scrolled into view.
- **Careers accordion** — single-open, animated via `grid-template-rows: 0fr → 1fr`,
  with a progress meter that fills on expand.
- **Reveals** — IntersectionObserver adds `.in`; a `<noscript>` block and a
  `prefers-reduced-motion` query both fall back to fully-visible, static content.

## Swapping in your own brand

- Wordmark: the string `Helios` in each page's header, footer and nav.
- Palette: the tokens under `:root` in `style.css`.
- Imagery: replace `assets/img/*.svg` with photography; the `.case--media` and
  `.careers__media` blocks already crop with `object-fit: cover`.
- Contact form posts nowhere — wire `[data-demo-form]` to your own endpoint.
