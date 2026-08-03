# YashOrbit Brand Identity

## The Mark — "Orbit Arrow"

The icon is a navy globe carrying the same **Y** monogram the brand has always used, with the "Orbit" half of the name made literal as a ring and a breakaway arrow:

- **The globe** is a filled navy circle (r=25.5 on a 64×64 grid) with a faint dot‑grid, sized bigger near the center and smaller toward the rim, to read as curvature without a gradient.
- **The Y monogram sits unchanged at the core** — two converging ice strokes and a stem, joined by the same coral node used since the first version of this mark. This is the one element carried forward untouched, so the mark still reads as an evolution, not a replacement.
- **The orbit ring** is a faint ice arc tucked behind the globe (drawn before it, so the sphere naturally occludes the middle of the curve) — a quiet echo of a satellite path.
- **The arrow** is a coral ribbon that sweeps up out of the globe and resolves into a solid arrowhead at the top‑right — growth, motion, forward momentum. It is the one place the mark departs from pure geometry, deliberately, to keep the "up and to the right" energy of the brand visible at a glance.

Construction grid: 64×64, globe radius 25.5, Y‑stroke width 8, node radius 4.8, centered with margin on all sides (safe under circular/squircle icon masks). See `icon.svg` for exact path data.

## Files

| File | Use |
|---|---|
| `icon.svg` | Navy icon, transparent background — light surfaces |
| `icon-light.svg` | Ice/white icon, transparent background — dark surfaces |
| `icon-mono-dark.svg` / `icon-mono-light.svg` | Single-color versions for restrictive placements (embroidery, engraving, watermarks) |
| `icon-tile.svg` / `icon-tile-*.png` | Filled navy square tile — favicons, app icons, social avatars |
| `icon-transparent.png` | Transparent PNG export of the icon at 512px |
| `wordmark.svg` / `wordmark-light.svg` | Wordmark alone, navy / light |
| `lockup-horizontal.svg` / `-light.svg` | Icon + wordmark, side by side — primary lockup |
| `lockup-vertical.svg` | Icon above wordmark, centered — profile/splash use |
| `lockup-horizontal-full.svg` / `-light.svg` | Icon + wordmark + "Technologies Pvt. Ltd." legal line — letterhead, invoices, contracts, official documents |
| `lockup-vertical-full.svg` | Icon above wordmark above the legal line, centered — formal cover pages, seals, signage |
| `icon-on-blue.svg` | Reversed icon (ice globe, navy Y, coral accents) — for navy/blue-colored surfaces where the standard navy globe would blend in |
| `lockup-horizontal-on-blue.svg` | Icon + wordmark built on `icon-on-blue.svg`, wordmark in ice/coral — for the same navy/blue surfaces |
| `lockup-horizontal-full-on-blue.svg` | The legal (icon + wordmark + "Technologies Pvt. Ltd.") lockup, rebuilt on `icon-on-blue.svg` — use this instead of `lockup-horizontal-full.svg` / `-light.svg` on any navy/blue surface |
| `social-avatar.png` | 512×512 filled tile for social profiles |

**Why `icon-on-blue.svg` exists:** the standard icon's globe is filled navy (`#1D428A`). Placed on a surface that's the *same* navy — e.g. this site's footer, whose dark-mode background token (`--secondary`) is also `#1D428A` — the globe's circular boundary disappears entirely, leaving only the Y and arrow floating with no visible container. `icon-on-blue.svg` swaps the globe to ice with a navy Y, so it stays legible on any navy/blue ground. `src/components/Footer.tsx` now renders the standard icon in light mode and this reversed icon in dark mode (`dark:hidden` / `dark:block`) for exactly this reason — check any other section that sits on a navy/blue background against this same-color trap before reusing the standard icon there.

The wordmark itself is two-tone: **Yash** in the primary text color (navy on light, ice on dark) and **Orbit** in coral — the same accent used for the node and arrow in the icon, so the name visually calls back to the mark. The legal line ("TECHNOLOGIES PVT. LTD.") always renders smaller, uppercase, tracked, and at reduced opacity in the primary text color — never in coral, so it stays visually secondary to the brand name.

Production `favicon.ico` and `apple-icon.png` live in `src/app/` (Next.js picks these up automatically).

## Color

| Token | Hex | Role |
|---|---|---|
| Navy | `#1D428A` | Primary mark, wordmark on light |
| Coral | `#E56043` | Node accent only — never the dominant fill |
| Ice | `#ECF2FD` | Mark and wordmark on dark surfaces |
| Ink | `#1b1a1a` | Monochrome mark, dark surfaces |

These match the site's existing theme tokens (`src/app/globals.css`) — no new colors were introduced.

## Typography

Wordmark: **Geist**, weight 800, letter-spacing −0.6 (matches the site's existing `--font-sans`). Fallback stack: `Geist, Inter, ui-sans-serif, system-ui, sans-serif`.

## Clear Space & Minimum Size

- Clear space on all sides of the lockup = the node's radius (6 units on the 64-unit grid), scaled to the mark's size.
- Minimum size, icon alone: 16px digital (favicon-safe) / 0.25in print.
- Minimum size, wordmark: 15px cap-height.

## Usage Rules

**Do**
- Use the horizontal lockup as the default (navbar, headers, email signatures).
- Use the icon alone for favicon, app icon, and social avatar.
- Place the mark only on backgrounds from the approved palette, or on plain photography with strong contrast.

**Don't**
- Stretch, skew, or otherwise distort the proportions.
- Recolor outside the four brand tokens.
- Add drop shadows, bevels, glows, or outlines to the flat mark.
- Place it on low-contrast or busy/gradient backgrounds without a solid backing plate.
- Rebuild the wordmark in a different typeface.

## Animation Notes

The mark was built for motion:

- The **node** can pulse, or drop into place at the joint on load (scale-in after the strokes draw).
- Each **stroke** can draw on (stroke-dashoffset) as an intro animation, converging into the node.
- On hover, the node can nudge slightly along the direction of arrival, reinforcing "connection."

Keep motion subtle — a 200–400ms ease on hover/load is enough; this is an enterprise mark, not a mascot.
