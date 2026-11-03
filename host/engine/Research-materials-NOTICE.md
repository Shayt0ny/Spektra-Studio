# Provisional material research, 2026-11-03

These are explicitly named research studies, not certified reproductions or new
measurements. Existing film/paper files are unchanged. The desktop adds a separate
test group and collapsed Material Studies panel explaining each limitation.
Red TEST badges and a Shayt0ny/unofficial-test notice identify these additions.
No Fotu/Film grain model is introduced. Ordinary builds load checked-in JSON;
there is no Python at runtime or build time.

`engine/tools/build_research_materials.py` records coarse chart readings, units,
origins, endpoint assumptions and named proxies, and rebuilds this directory
offline. The plotting precision is approximately 0.05 D, 5-10 nm and 0.1 log
sensitivity. Interpolation does not add measurement precision. Source PDF URLs
and processing conditions are recorded per profile. Original source documents
retain their copyrights and are not redistributed here. Brands are trademarks
of their respective owners; no endorsement is implied.

- **Ortho Plus 80:** ILFORD October 2019 pp.1/3, ID-11 stock 20 C 8 min,
  G .62 pictorial curve. Distinct blue/green-only wedge, negligible red band.
  Wedge ordinate is assumed logarithmic as drawn (like the HP5 product study),
  without recovered source-lamp correction. Neutral silver/base, exposure
  origin, flat endpoints and grain remain assumptions.
- **Velvia 50:** FUJIFILM RVP50 AF3-0221E2 March 2007 p.8, daylight
  E-6/CR-56, Status A transmission density. Independent H-D, sensitivity and
  processed dye-chart readings; no Velvia 100 arrays borrowed. Narrow-band
  demixing is approximate, not a recovered Status-A band-integral fit. Flat
  neutral Dmin .06 and out-of-chart spectral tails are assumed. It is a
  transparency, not an instant reflection layer; grain/MTF are not calibrated.
- **Delta 3200:** ILFORD November 2018 pp.1/5, DD-X 1+4 20 C plotted 9 min
  curve. This is not the recommended 9.5 min EI-3200 process. ISO 1000 and
  recommended EI 3200 are different quantities. Same explicit relative-wedge,
  neutral silver/base, exposure-origin and grain limitations as Ortho.
- **Double-X 5222:** Kodak H-1-5222 March 2022, D-96 21 C, 6.5 min gamma .66.
  Characteristic and spectral chart readings; neutral silver and base assumed.
  Unpublished shoulder is held constant. Grain and spatial response not calibrated.
- **Phoenix 200 Gen 1:** HARMAN September 2024 first-generation charts, C-41.
  Wedge spectral axis interpretation and exposure origin require validation.
  Dye/base arrays are explicitly borrowed from spektrafilm's Vision3 250D profile,
  **CC BY-SA 4.0**. This derivative profile is distributed under that same licence;
  Copyright (c) 2026 Andrea Volpato, https://github.com/andreavolpato/spektrafilm .
  The full licence remains in the app's existing
  `Resources/Licenses/Profiles-and-LUTs-CC-BY-SA-4.0.txt` notice.
  No Phoenix dye measurements claimed.
- **Maxima:** FUJIFILM AF3-0252E2 April 2019, spectral dye/sensitivity chart readings.
  H-D curves borrow the named Crystal Archive Type II profile, **CC BY-SA 4.0**;
  this derivative is under the same licence and attribution above. No Maxima H-D curves, digital exposure
  calibration or colour balance have been recovered. This is a spectral study.
- **Instax mini:** historical FUJIFILM sheet, 5500 K 1/100 s, 25 C, density read
  at 24 h. Effective reflection-density prototype. No modern batch equivalence,
  reagent diffusion, grain, rollers or camera optics calibration. A separate
  output stage supplies the white paper/window geometry and authored ink;
  it is not part of these material response data.
- **Polaroid T-600:** original Polaroid Corporation pre-2008 T-600 family sheet,
  21 C ~3 min, preserved by 125px. Not today's 600/i-Type chemistry. The sheet's
  H-D and sensitivity curves are used; Instax dye shapes are an explicit proxy.
  They are not Polaroid dye measurements. Same effective reflection limitations.

New chart readings and code-generated numerical constructions are dedicated to
CC0-1.0, except the Phoenix and Maxima derivatives covered above. Scientific
meaning and claimed validation are limited by each profile's metadata. A render
passing numerical checks is evidence of implementation, not material accuracy.

`calibration.json` holds numerical exposure normalization from the native
Hanatos 18.4% grey probe. It fixes an arbitrary relative chart origin, not dye
cross-talk or colour accuracy. Source PDFs/download hashes and visual overlays
used for this session live in ignored `build/material-research-20261103/`.

`paper_models.json` contains only the unmodified named Type II proxy used by
Maxima, distributed under CC BY-SA 4.0 with the Andrea Volpato/spektrafilm
attribution above. `sources.json` pins the exact PDF bytes reviewed.

FB Warmtone and ART 300 grade-2 studies were removed at the user's request
after reviewing their missing colour/white/surface calibration, 2026-11-03.
Their profiles, catalogue entries, generator readings/fits and trial shortcut
are no longer included. Previously published 1.0.9 archives are unchanged.

Instant H-D curves are filter-channel densities, not dye concentrations. They
are demixed through an assumed narrow-band 640/550/440 nm densitometer before
spectral evaluation, avoiding doubled dye overlap. This is an approximation,
not a recovered manufacturer densitometer or a full dye-transfer model.

Instant output geometry follows the published overall/window dimensions:
mini 54x86 / 46x62 mm; legacy T-600 3.5x4.25 in / 3.125 in square.
Mini's approximate 7 mm top placement follows FUJIFILM's front-on product
illustration (https://instax.jp/item/film/); T-600 top/side placement assumes
equal margins. Neither is a recovered factory drawing/tolerance. White is
neutral. The output renderer now adds distinct procedural mini/T-600 surface
relief, cut edges and a recessed image seal in physical millimetres. This is
an antialiased fixed-light appearance approximation, not calibrated texture,
gloss or BRDF; no material response array was changed for it. Gold/silver handwriting
is a deterministic fixed-light pigment illustration, not measured metallic
BRDF or a branded pen reproduction. Original manufacturer artwork is not
bundled or used as a border texture.
