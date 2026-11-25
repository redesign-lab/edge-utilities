# Edge Utilities, Inc. — Official Website Demo

Custom-designed static business homepage for **Edge Utilities, Inc.**, a licensed underground utility contractor headquartered in Hattiesburg, Mississippi (MS State Board of Contractors License `#25895-MC`, Municipal and Public Works Construction).

## Verified Company Details
- **Company:** Edge Utilities, Inc.
- **Address:** 52 Cherry Laurel Loop, Hattiesburg, MS 39402 (Lamar County)
- **Phone:** (601) 606-8838
- **Owner:** Hunter Dunaway
- **Qualifying Member (MSBOC #25895-MC):** Heath Kole Bedwell
- **Core Services:** Municipal & commercial water mains, sanitary sewer & precast lift stations, storm drainage & culverts, and horizontal directional boring (HDD).

## Project Structure
```text
.
├── index.html
├── .nojekyll
├── README.md
├── assets/
│   ├── fonts/       # Locally bundled Manrope & Inter WOFF2 webfonts
│   ├── icons/       # SVG utility icon sprite
│   ├── images/      # Industry-specific heavy civil field photography
│   └── logo/        # Exact transparent Edge Utilities PNG logo & favicon
├── css/
│   └── style.css    # Mobile-first CSS custom properties & layout styles
└── js/
    └── script.js    # Navigation drawer, service filter, FAQ & scope builder
```

## GitHub Pages Compatibility
- Built with pure static HTML5, CSS3, and Vanilla JS (no build step or server runtime required).
- Includes `.nojekyll` and relative asset paths (`./assets/...`) so it runs cleanly at root or subdirectory URLs.
- Includes `<meta name="robots" content="noindex, nofollow">` for demo indexing protection.
