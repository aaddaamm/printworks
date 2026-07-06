# SEO, Accessibility, and GitHub CI Design

## Goal

Run a complete SEO audit, run a complete accessibility audit, and add a
lightweight best-practices GitHub CI process for the Robinson PrintWorks
static site.

## Current context

- Static one-page site served from `index.html` with styles in `styles.css`.
- Existing public crawl files: `robots.txt`, `sitemap.xml`, `llms.txt`,
  favicons, manifest, and Open Graph image.
- Existing npm script: `npm run check` runs `html-validate index.html`.
- Current working tree already has modified `index.html` and `styles.css`;
  changes must be targeted and avoid overwriting unrelated edits.

## Recommended approach

Use a lean static-site audit and CI workflow:

1. Run local automated validation for HTML and available package scripts.
2. Review SEO fundamentals: title, description, canonical, robots,
   Open Graph/Twitter, schema, heading hierarchy, crawlable links, sitemap,
   robots, image metadata, and performance-sensitive markup.
3. Review accessibility fundamentals: landmarks, skip link, focus styles,
   keyboard-operable dialog/gallery behavior, alt text, labels,
   contrast-sensitive patterns, reduced motion, mobile/tap-target behavior.
4. Add GitHub Actions CI on pull requests and pushes to `main`.
5. Add lightweight custom validation where existing `html-validate` coverage
   does not cover static-site SEO/accessibility guardrails.

## CI design

CI should run on:

- `pull_request`
- `push` to `main`

CI should verify:

- Dependencies install reproducibly with `npm ci`.
- HTML validation passes with `npm run check`.
- Static SEO/accessibility guardrails pass through a project-local script.
- Required crawl/social assets exist: `robots.txt`, `sitemap.xml`,
  `site.webmanifest`, favicon assets, and Open Graph image.

## Constraints

- Keep the site static; do not introduce a framework.
- Keep dependencies minimal.
- Preserve existing SEO work unless an audit finding shows it is incorrect.
- Keep changes compatible with GitHub-hosted runners.
- Do not stage or overwrite unrelated user changes.

## Verification

Run locally before completion:

- `npm run check`
- Any new CI validation script
- `git diff --check`

## Out of scope

- Live Google Search Console inspection.
- Paid SEO keyword research.
- Full Lighthouse CI unless requested later.
- Browser/screen-reader manual QA beyond source-level and available local
  checks in this pass.
