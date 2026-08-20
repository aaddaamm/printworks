# Service-Page SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three helpful, indexable service pages and reinforce homepage, video, and discovery metadata for Robinson PrintWorks.

**Architecture:** Create a shared, data-driven service-page template rendered by `scripts/build-site.mjs`; keep shared header/footer markup in existing components. The static audit becomes the regression test suite for page metadata, schema, internal links, and sitemap coverage. Generated HTML stays committed.

**Tech Stack:** Static HTML, Node.js ESM build/audit scripts, Prettier, html-validate.

**Spec:** `docs/superpowers/specs/2026-08-19-service-page-seo-design.md`

## Global Constraints

- Publish only the three approved intent pages: replacement parts, prototype printing, and mounts/organizers.
- Do not fabricate business address, reviews, ratings, credentials, video dates/durations, or safety/performance guarantees.
- Each service page must contain materially distinct, useful visible copy and one matching `Service` JSON-LD object.
- Preserve the existing visual system and reuse shared header/footer components.
- Use standard anchors for all internal navigation; no city-keyword doorway pages.

---

### Task 1: Establish SEO regression expectations

**Files:**

- Modify: `scripts/static-audit.mjs`
- Test: `scripts/static-audit.mjs`

**Interfaces:**

- Consumes: generated HTML at `replacement-parts/index.html`, `prototype-printing/index.html`, and `mounts-organizers/index.html`.
- Produces: static-audit failures for missing service routes, metadata, self-canonicals, service schema, homepage links, sitemap entries, `llms.txt` references, and video schema.

- [ ] **Step 1: Add a failing service-page audit loop**

Add the following route expectations after the existing quote-page checks:

```js
const servicePages = [
  {
    path: "replacement-parts/index.html",
    url: "https://robinsonprintworks.com/replacement-parts",
    title: "3D Printed Replacement Parts in Rhode Island | Robinson PrintWorks",
  },
  {
    path: "prototype-printing/index.html",
    url: "https://robinsonprintworks.com/prototype-printing",
    title: "Prototype 3D Printing in Rhode Island | Robinson PrintWorks",
  },
  {
    path: "mounts-organizers/index.html",
    url: "https://robinsonprintworks.com/mounts-organizers",
    title: "Custom 3D Printed Mounts & Organizers | Robinson PrintWorks",
  },
];
```

Read every page, require its exact title, unique description, self-canonical, robots directive containing `index` and `follow`, JSON-LD containing `"@type": "Service"`, an H1, and a link to `/quote`. Require every URL in `sitemap.xml` and every route in `llms.txt`.

- [ ] **Step 2: Add failing homepage expectations**

Require homepage source to contain:

```js
/Custom 3D Printing in Rhode Island/i
/https:\/\/schema\.org\/VideoObject/i
/href=["']\/replacement-parts["']/i
/href=["']\/prototype-printing["']/i
/href=["']\/mounts-organizers["']/i
```

- [ ] **Step 3: Verify the audit fails for the expected reason**

Run: `npm run audit:static`

Expected: nonzero exit with missing service-page/public-asset or service-page SEO assertion failures, because no new pages exist yet.

- [ ] **Step 4: Commit the test-first change**

```bash
git add scripts/static-audit.mjs
git commit -m "test: require service page SEO assets"
```

### Task 2: Add reusable service-page sources and rendering

**Files:**

- Create: `site/service-pages.mjs`
- Create: `site/service-page.template.html`
- Modify: `scripts/build-site.mjs`
- Create: `replacement-parts/index.html`
- Create: `prototype-printing/index.html`
- Create: `mounts-organizers/index.html`
- Test: `scripts/static-audit.mjs`

**Interfaces:**

- `site/service-pages.mjs` exports `servicePages`, an array of page objects containing `slug`, `title`, `description`, `heading`, `intro`, `serviceName`, `serviceDescription`, and body HTML.
- `site/service-page.template.html` contains named placeholders resolved by the build script.
- `scripts/build-site.mjs` renders the homepage as before and writes one formatted `index.html` per service-page `slug`.

- [ ] **Step 1: Create the page data module**

Export precisely three page objects. Keep each page unique:

- `replacement-parts`: explain that photos, broken parts, and rough dimensions help; state that fit, material, load, heat, and safety concerns are reviewed before accepting work.
- `prototype-printing`: explain that prototypes help check fit and shape before a final version; state that a sketch, reference, or existing file can start the process.
- `mounts-organizers`: explain that custom brackets, mounts, cable guides, and organizers should begin with the space, dimensions, expected load, and attachment method.

Every page object must include `relatedSlugs` containing the other two routes so the rendered page creates an internally linked cluster.

- [ ] **Step 2: Create the reusable HTML template**

Use the existing `components/document-head.html` structure as the visual/metadata reference, but make service-page metadata independent. Template requirements:

```html
<title>{{title}}</title>
<meta name="description" content="{{description}}" />
<link rel="canonical" href="{{canonicalUrl}}" />
<meta property="og:url" content="{{canonicalUrl}}" />
<main id="main-content">
  <article class="section service-page">
    <h1>{{heading}}</h1>
    <p class="service-intro">{{intro}}</p>
    {{body}}
  </article>
</main>
```

Use existing header/footer includes, a skip link, the existing stylesheet and analytics scripts, a single `Service` JSON-LD object whose `name`, `description`, `url`, and `provider.@id` are derived from the page data, and a visible quote CTA plus related-service anchors.

- [ ] **Step 3: Extend the build script**

Keep `render()` for component includes. Add a `renderServicePage(page)` helper that replaces only explicit `{{placeholder}}` values and rejects an unresolved placeholder. Write each result to `${page.slug}/index.html`, format it with Prettier, and in `--check` mode compare all generated files to disk. Preserve existing homepage behavior.

- [ ] **Step 4: Build generated output**

Run: `npm run build`

Expected: `replacement-parts/index.html`, `prototype-printing/index.html`, and `mounts-organizers/index.html` are created and formatted; homepage remains generated from components.

- [ ] **Step 5: Verify the service-page audit is green**

Run: `npm run audit:static`

Expected: prior route/metadata/schema failures are gone. Address any remaining assertion before continuing.

- [ ] **Step 6: Commit the rendering unit**

```bash
git add site/service-pages.mjs site/service-page.template.html scripts/build-site.mjs replacement-parts/index.html prototype-printing/index.html mounts-organizers/index.html
git commit -m "feat: add service page SEO cluster"
```

### Task 3: Connect the homepage and add accurate video schema

**Files:**

- Modify: `site/components/home/hero.html`
- Modify: `site/components/home/services.html`
- Modify: `site/components/document-head.html`
- Modify: `index.html`
- Test: `scripts/static-audit.mjs`

**Interfaces:**

- Homepage service links point to the three generated canonical paths.
- The homepage JSON-LD graph contains six `VideoObject` entries using only existing media URLs and visible titles.

- [ ] **Step 1: Change the homepage H1**

Replace the hero H1 with:

```html
<h1>Custom 3D Printing in Rhode Island for Parts, Prototypes, and More</h1>
```

Retain the existing practical supporting copy and hero image.

- [ ] **Step 2: Add a compact service-link group**

In `site/components/home/services.html`, add three normal anchors directly beneath the section introduction. Use these exact destinations:

```html
<a href="/replacement-parts">Replacement parts</a>
<a href="/prototype-printing">Prototype printing</a>
<a href="/mounts-organizers">Custom mounts &amp; organizers</a>
```

Describe each link in one useful sentence without repeating the full destination-page copy.

- [ ] **Step 3: Add six VideoObject entities**

Within the homepage JSON-LD `@graph`, add six `VideoObject` objects with `name`, `description`, `thumbnailUrl`, `contentUrl`, and `embedUrl` only when it equals the public page URL containing the video. Use the exact existing names, poster files, and `.mp4` files from `site/components/home/timelapses.html`. Do not add `uploadDate`, `duration`, or claims not shown on the page.

- [ ] **Step 4: Rebuild and verify**

Run:

```bash
npm run build
npm run check
npm run audit:static
```

Expected: all commands pass and generated `index.html` includes the new H1, anchors, and valid JSON-LD.

- [ ] **Step 5: Commit the homepage unit**

```bash
git add site/components/home/hero.html site/components/home/services.html site/components/document-head.html index.html
git commit -m "feat: strengthen homepage service discovery"
```

### Task 4: Update discovery assets and complete verification

**Files:**

- Modify: `sitemap.xml`
- Modify: `llms.txt`
- Modify: `scripts/static-audit.mjs`
- Test: `scripts/static-audit.mjs`

**Interfaces:**

- `sitemap.xml` contains one public `<url>` record per approved service page.
- `llms.txt` lists all three pages in its Main Pages section.

- [ ] **Step 1: Add the three sitemap URLs**

Add one `<url>` element for each canonical service URL. Use `<lastmod>2026-08-19</lastmod>`, `monthly`, and priority `0.8`. Do not add image sitemap entries unless the specific image is visibly used on that page.

- [ ] **Step 2: Update `llms.txt`**

Under `## Main Pages`, add a concise, factual bullet for each service page. State the particular intent it serves and that each page links to the quote workflow.

- [ ] **Step 3: Make the audit exact**

Ensure `scripts/static-audit.mjs` treats missing service pages as failures, not warnings, and verifies every route once in sitemap and homepage link group. Ensure the service-page `Service` JSON-LD is parsed by `JSON.parse`, not checked only by substring.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run format:check
npm run check
npm run audit:static
node --check scripts/build-site.mjs
node --check scripts/static-audit.mjs
```

Expected: all commands exit zero. Review `git diff --check` for whitespace errors.

- [ ] **Step 5: Commit discovery and audit completion**

```bash
git add sitemap.xml llms.txt scripts/static-audit.mjs
git commit -m "feat: publish service page discovery metadata"
```
