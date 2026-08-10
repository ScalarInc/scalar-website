# Scalar — Built for what's next.

Marketing site for Scalar, a product studio building AI systems across five
tracks. Next.js App Router, Tailwind v4, Motion, Lenis. Monochrome throughout.

## Run

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/
  layout.tsx          fonts, metadata, header/footer shell
  page.tsx            section composition
  globals.css         design tokens + primitives
components/
  Hero.tsx            orbital canvas + Scalar mark + split tagline
  Capabilities.tsx    horizontal auto-advancing accordion (5 panels)
  Approach.tsx        3 steps with technical line-art plates
  Partnering.tsx      halftone aperture statement
  Work.tsx            14-project grid, filters, morphing detail modal
  Studio.tsx          sector marquee, stats, principles accordion
  Contact.tsx         form, posts to /api/contact
  Header.tsx          sticky header + full-screen menu overlay
  Footer.tsx          oversized mark + sitemap
  SmoothScroll.tsx    Lenis, disabled under reduced-motion
  ui/                 Reveal, SplitText, PlusLink
lib/projects.ts       the 14 products, from projects.xlsx
public/brand/         scalar-mark.png (alpha), scalar-banner.png
legacy/               the previous static HTML build, kept for reference
api/                  FastAPI contact service (see api/README.md)
```

## Design system

Greyscale only — `ink-950` through `ink-50`, plus `paper`. No hue anywhere. The
one "colour" is the `.metal` gradient (a brushed-steel sweep clipped to text),
which echoes the Scalar mark and is used on the wordmark and the word "Next."

Type pairs Inter for display with JetBrains Mono for labels, technical readouts
and body copy inside dark panels.

Sections alternate dark/light and overlap with a rounded lip (`.lip` + negative
margin), so each one rides over the section above it.

## Notable implementation details

- **Hero canvas** — four dotted orbital rings at differing speeds and tilts,
  drifting dust, and three crosshair markers reporting angular position. Markers
  oscillate within a narrow arc so their readouts never drift under the
  headline, and are dropped below 900px. Pointer parallax is spring-damped; the
  whole composition fades and lifts on scroll via `useScroll`.
- **Capabilities accordion** — panels animate `flexGrow`, so the same component
  is a row on desktop and a column on mobile. Auto-advances every 5.2s, pauses
  on hover, and the dwell progress bar is keyed to restart per panel. The
  collapsed label unmounts while active so it can't ghost through the expanded
  content.
- **Work grid** — `layoutId` shares the card, index and title between the grid
  tile and the detail modal, so opening a project morphs rather than cuts.
  Filters animate the active pill with a shared `layoutId` and re-flow the grid
  via `layout`. Each card gets a deterministic geometric glyph derived from its
  slug.
- **Halftone aperture** — canvas dot matrix that clears a centre rectangle and
  fades along an ellipse, with bracket marks on the aperture corners.

### Two things worth knowing

- **The mark needed an alpha channel.** The supplied `logo.png` is light-on-black
  with no transparency, so it rendered as a black tile on every background.
  `public/brand/scalar-mark.png` is derived from it: luminance becomes alpha and
  the colour is un-premultiplied. Regenerate it if the source art changes.
- **SVG paths are rounded to 3dp.** `Math.cos`/`Math.sin` differ in the last bit
  between Node and V8 in the browser, which produced a hydration mismatch on the
  generated diagram and glyph paths. Keep the `.toFixed(3)` when editing those.

## Content

`lib/projects.ts` is transcribed from `scalar-assests/projects.xlsx` — note the
spreadsheet's first row is a project, not a header. Copy was lightly edited for
consistent tense and punctuation. The unnamed sign-language project is titled
"Sign Language Companion" and flagged `status: "Concept"`.

Contact details (`hello@scalar.dev`) are placeholders — swap them in
`Header.tsx`, `Contact.tsx` and `Footer.tsx`.

## Contact form

The form posts to `/api/contact`, which `next.config.mjs` rewrites to the FastAPI
service in `api/` — so the request stays same-origin and there is no CORS setup
anywhere. Both processes need to be running:

```sh
cd api && uv run uvicorn app.main:app --reload --port 8000
npm run dev
```

Delivery goes through Resend. See `api/README.md` for configuration, and note the
sending-domain constraint there: until a domain is verified in Resend, mail can
only be delivered to the address that owns the Resend account, which is why the
auto-reply ships disabled.
