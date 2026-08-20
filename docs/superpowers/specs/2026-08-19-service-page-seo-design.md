# Robinson PrintWorks Service-Page SEO Design

## Goal

Expand the site from two indexable pages to a small, useful service-content cluster that can rank for distinct Rhode Island custom 3D-printing intents without creating thin location pages.

## Scope

### New public pages

- `/replacement-parts`
- `/prototype-printing`
- `/mounts-organizers`

Each page will:

- Have one intent-specific title, meta description, canonical URL, and Open Graph/Twitter metadata.
- Use a single keyword-and-location-aligned H1, followed by a direct-answer introduction.
- Describe only services already represented on the homepage: printability review, material guidance, local pickup by arrangement, shipping by request, and the quote process.
- Include service-specific examples, practical fit/limitation guidance, an internal link to the other relevant services, and a quote CTA.
- Include visible content that matches a `Service` JSON-LD object linked to the existing `ProfessionalService` entity.
- Preserve the existing navy/neutral visual system and restrained cyan accent usage by reusing the current header, footer, CSS, and components.

### Homepage changes

- Replace the generic homepage H1 with an explicit service-and-location heading.
- Add a compact, crawlable service-page link group. It must use standard `<a href>` elements and add no visual redesign.
- Add `VideoObject` JSON-LD entries for the six existing time-lapse videos. Each entry will use the existing video, poster image, visible title, and a conservative description; no durations or upload dates will be invented.

### Discovery assets

- Add the three canonical URLs to `sitemap.xml`, using the current date as `<lastmod>`.
- Add the three pages to `llms.txt` with concise descriptions.
- Extend the existing static audit to enforce each service page's public metadata, canonical, schema, sitemap entry, and crawlable link from the homepage.

## Out of Scope

- City-specific pages, unverified customer claims, reviews, ratings, Google Business Profile changes, address/geo data, product/merchant feed schema, and visual redesign.
- Claims of Core Web Vitals, indexing, ranking, backlink, or Google Business Profile performance without external data.

## Architecture

The static build will gain a reusable service-page template plus per-page content data. The existing build script will render the homepage and each service page from those sources, keeping generated HTML committed. Existing shared header/footer content remains the single source of truth. The static audit is the regression test harness for generated HTML and discovery files.

## Content Rules

- Copy stays direct, local, practical, and transparent about 3D-printing limitations.
- Each page serves one distinct user intent and includes meaningful, non-duplicated guidance.
- Do not claim guaranteed fit, structural safety, food safety, heat resistance, delivery timing, or pricing beyond the current site's stated ranges and review process.
- Do not fabricate image provenance, video dates, video duration, credentials, testimonials, or business-location details.

## Testing and Verification

1. Extend the static audit with assertions for every new route and its SEO requirements.
2. Run the new audit first and confirm it fails because the new routes do not exist.
3. Implement the minimal templates, content data, generated pages, discovery updates, homepage links, and video schema.
4. Run `npm run build`, `npm run check`, and `npm run audit:static`.
5. Validate generated HTML with the existing HTML validator and manually inspect all changed JSON-LD blocks for valid JSON.

## Acceptance Criteria

- The homepage H1 explicitly describes custom 3D printing in Rhode Island.
- All three service pages are generated, internally linked, canonicalized, indexable, and listed in the sitemap and `llms.txt`.
- Every new page has a unique title, description, and `Service` JSON-LD with content that appears visibly on that page.
- Homepage video structured data accurately represents the six existing time-lapse videos without made-up metadata.
- Existing and extended automated checks pass.
