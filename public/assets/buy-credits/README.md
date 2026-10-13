# Buy Credits assets

## Ad Options clips (`ad-*.json`)

Four Lottie clips, one per ad product, per locale. They are **not** raw Design
exports — a Design export embeds every image as a base64 data URI, which made
each clip ~430 KB and shipped the same artwork four times.

**Silver, premium and turbo share one image.** Their clips reference
`ad-grid-{locale}.webp` by filename instead of embedding it, so whichever
product the visitor reaches first warms it for the other two. `devicePreview.js`
passes `assetsPath` to `loadAnimation` so lottie resolves those filenames
through the CDN.

**Pump reuses that same grid image.** Its `lower` artwork was a separate export
of the bottom slice of the grid (pixel-identical bar re-encode noise), so the
clip now points at `ad-grid-{locale}.webp` with the layer anchored at the row
the slice used to start from — 808 for en, 776 for ar. Drawing the full grid
makes the rows above that point visible, so a solid `grid-clip` layer sits
directly above `lower` to cover them; without it, grid artwork leaks into the
gaps between the sliding cards.

**Pump's three card images stay embedded.** They are unique to that clip, so
externalizing them saves nothing: gzip recovers almost all of the base64
overhead (measured: 108.8 KB embedded vs 107.8 KB external), and embedding
costs three fewer requests.

`ad-silver-{locale}.json` also carries a manual fix: the `t=45` and `t=135`
hold keyframes are shifted 13px to correct a row that overran the comp in the
Design export.

### Replacing these with a new Design export

A fresh export will be self-contained again and will drop everything above.
Before committing one, redo: extract and dedupe the shared grid image, point
pump's `lower` at it with the anchor offset plus the `grid-clip` cover layer,
and re-apply the Silver keyframe fix. Check the numbers above still hold — a
different crop or layer order means they won't.

## Other assets

- `hero-buy-credits-{locale}.webp` — 1200x676. Desktop caps the illustration at
  `max-w-[1000px]`, mobile renders it at ~507 CSS px, so this covers DPR2.
- `coin-spin.mp4` / `coin-poster.webp` — the rotating coin; the poster is the
  `prefers-reduced-motion` fallback.
- `og-buy-credits-{locale}.webp` — 1200x630 OpenGraph cards.
- `credits-coin.webp`, `package-*.svg` — inline icons.
