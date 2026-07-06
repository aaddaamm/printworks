# SEO Accessibility CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit SEO and accessibility for the Robinson PrintWorks static site
and add lightweight GitHub CI guardrails.

**Architecture:** Keep the site static. Use existing `html-validate` for
standards validation, add a small Node-based guardrail script for static SEO
and accessibility checks, and run both from GitHub Actions on PRs and pushes
to `main`.

**Tech Stack:** Static HTML/CSS, Node/npm, html-validate, GitHub Actions.

## Global Constraints

- Keep the site static; do not introduce a framework.
- Keep dependencies minimal.
- Preserve existing SEO work unless an audit finding shows it is incorrect.
- Keep changes compatible with GitHub-hosted runners.
- Do not stage or overwrite unrelated user changes.

---

### Task 1: Run baseline audit

**Files:**

- Read: `index.html`
- Read: `styles.css`
- Read: `robots.txt`
- Read: `sitemap.xml`
- Read: `package.json`

**Interfaces:**

- Consumes: current repository files.
- Produces: list of SEO/accessibility findings and validation gaps.

- [ ] **Step 1: Run existing HTML validation**

Run: `npm run check`
Expected: PASS, or actionable HTML validation failures.

- [ ] **Step 2: Inspect SEO metadata and crawl files**

Check for exactly one title, one meta description, canonical URL, robots meta,
Open Graph/Twitter tags, JSON-LD, `robots.txt`, `sitemap.xml`, favicon and
manifest assets, image sitemap coverage, and crawlable links.

- [ ] **Step 3: Inspect accessibility fundamentals**

Check skip link, landmarks, one `h1`, sequential headings, image alt text,
form labels, focus styles, keyboard-operable gallery/dialog, reduced motion,
and hidden mobile navigation behavior.

### Task 2: Add static audit guardrail script

**Files:**

- Create: `scripts/static-audit.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: `index.html`, `styles.css`, `robots.txt`, `sitemap.xml`, and
  required public assets.
- Produces: `npm run audit:static` command that exits non-zero when guardrails
  fail.

- [ ] **Step 1: Create script that checks required files and HTML patterns**

Create `scripts/static-audit.mjs` with Node `fs`-based checks for title,
meta description, canonical, robots, social tags, JSON-LD, skip link, main
landmark, one h1, image alts, crawlable internal links, and required public
assets.

- [ ] **Step 2: Add npm script**

Add `"audit:static": "node scripts/static-audit.mjs"` to `package.json`
scripts.

- [ ] **Step 3: Run static audit**

Run: `npm run audit:static`
Expected: PASS, or clear finding messages.

### Task 3: Add GitHub Actions CI

**Files:**

- Create: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: npm scripts `check` and `audit:static`.
- Produces: CI workflow for `pull_request` and `push` to `main`.

- [ ] **Step 1: Create workflow**

Create `.github/workflows/ci.yml` with checkout, Node 22 setup, npm cache,
`npm ci`, `npm run check`, and `npm run audit:static`.

- [ ] **Step 2: Verify workflow syntax is simple YAML**

Confirm no secrets or deployment credentials are required.

### Task 4: Final verification and report

**Files:**

- Read/verify: changed files only.

**Interfaces:**

- Consumes: outputs from Tasks 1-3.
- Produces: final audit summary, files changed, commands run, remaining risks.

- [ ] **Step 1: Run all local verification**

Run:

```bash
npm run check
npm run audit:static
git diff --check
```

Expected: all commands pass.

- [ ] **Step 2: Summarize audits**

Report SEO findings, accessibility findings, CI changes, commands run, and
remaining risks.
