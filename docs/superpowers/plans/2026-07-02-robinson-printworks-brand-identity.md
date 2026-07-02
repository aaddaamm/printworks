# Robinson PrintWorks Brand Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the Robinson PrintWorks static site and supporting assets into a cohesive premium maker brand system.

**Architecture:** The brand spec is the source of truth. The Brand Guardian skill governs future brand-facing edits. Implementation starts with documentation and CSS tokens, then expands into copy/metadata, product photography prompts, packaging, social templates, and visual assets.

**Tech Stack:** Static HTML, plain CSS, Markdown documentation, image assets, Vercel static hosting.

## Global Constraints

- Preserve the existing clean local-service site structure; evolve it rather than replacing it casually.
- Preferred identity direction is Deep Midnight Navy + restrained Electric Cyan.
- Accent usage should be approximately 15% of the composition.
- Avoid cyberpunk, RGB gamer, comic, steampunk, overly aggressive industrial, cheap Etsy, and generic 3D printer hobby branding.
- Printers may appear as tools, but must not become the brand centerpiece.
- Brand-facing work must use `.claude/skills/brand-guardian/SKILL.md`.
- Do not overwrite existing user work in `index.html` or `llms.txt` without reviewing diffs first.

---

## File Structure

- `docs/superpowers/specs/2026-07-02-robinson-printworks-brand-identity-design.md` — source-of-truth brand design spec.
- `.claude/skills/brand-guardian/SKILL.md` — project skill for brand-facing work.
- `docs/brand/` — practical brand guide, audit, prompts, packaging, and template specs.
- `styles.css` — visual token and component styling implementation.
- `index.html` — copy, metadata, schema, and page structure; currently has pre-existing user edits, so treat carefully.
- `templates/social/` — existing social templates to align with the visual system.

---

### Task 1: Brand Governance Foundation

**Files:**

- Create: `docs/superpowers/specs/2026-07-02-robinson-printworks-brand-identity-design.md`
- Create: `.claude/skills/brand-guardian/SKILL.md`
- Create: `docs/brand/README.md`
- Create: `docs/brand/current-site-audit.md`

**Steps:**

- [x] Add source-of-truth brand spec.
- [x] Add project-level Brand Guardian skill.
- [x] Add `docs/brand/README.md`.
- [x] Add current website brand audit.
- [ ] Verify no placeholders:

```bash
cd /Users/adam/robinson_printworks
! grep -R "To be filled\|TBD\|TODO" docs/brand docs/superpowers/specs .claude/skills/brand-guardian
```

- [ ] Commit only governance docs:

```bash
cd /Users/adam/robinson_printworks
git add docs/superpowers/specs/2026-07-02-robinson-printworks-brand-identity-design.md .claude/skills/brand-guardian/SKILL.md docs/brand/README.md docs/brand/current-site-audit.md docs/superpowers/plans/2026-07-02-robinson-printworks-brand-identity.md
git commit -m "docs: add Robinson PrintWorks brand foundation"
```

---

### Task 2: CSS Brand Token Pass

**Files:**

- Modify: `styles.css`

**Steps:**

- [ ] Read `styles.css` before editing.
- [ ] Replace neon/magenta token values with brand tokens while preserving existing selector names where possible.
- [ ] Update body background to navy/graphite/cyan only.
- [ ] Reduce logo, card, and headline glow intensity.
- [ ] Keep layout unchanged.
- [ ] Verify there are no remaining magenta/neon color literals unless explicitly justified:

```bash
cd /Users/adam/robinson_printworks
rg "d946ef|ff2bd6|7cffcb|217, 70, 239|255, 43, 214|124, 255, 203" styles.css
```

Expected: no output or only intentionally documented legacy references.

- [ ] Commit CSS token pass:

```bash
cd /Users/adam/robinson_printworks
git add styles.css
git commit -m "feat: align site styling with brand system"
```

---

### Task 3: Copy and Metadata Consistency

**Files:**

- Modify: `index.html`
- Modify: `README.md`
- Possibly modify: `llms.txt`

**Steps:**

- [ ] Review current user changes first:

```bash
cd /Users/adam/robinson_printworks
git diff -- index.html
```

- [ ] Standardize brand-facing name to `Robinson PrintWorks` where appropriate.
- [ ] Preserve local SEO intent and existing schema coverage.
- [ ] Avoid unverified claims about tolerances, turnaround, certifications, or engineering guarantees.
- [ ] Commit copy/metadata separately:

```bash
cd /Users/adam/robinson_printworks
git add index.html README.md llms.txt
git commit -m "docs: align site copy with brand naming"
```

---

### Task 4: Product Render and Photography Prompt Pack

**Files:**

- Create: `docs/brand/product-render-prompts.md`

**Steps:**

- [ ] Add base style prompt for dark studio navy/cyan product photography.
- [ ] Add ecosystem board prompt covering gecko, Gridfinity bins, organizers, signs, coasters, tool tray, packaging insert, and branded calibration cube.
- [ ] Add negative prompt excluding cyberpunk, RGB gamer, comic, steampunk, cheap Etsy, and cyan-dominant surfaces.
- [ ] Add shot list for web, social, marketplace, and packaging.
- [ ] Commit:

```bash
cd /Users/adam/robinson_printworks
git add docs/brand/product-render-prompts.md
git commit -m "docs: add brand render prompt pack"
```

---

### Task 5: Packaging and Social Template Specs

**Files:**

- Create: `docs/brand/packaging-system.md`
- Create: `docs/brand/social-marketplace-templates.md`
- Review: `templates/social/`

**Steps:**

- [ ] Define packaging system for boxes, labels, thank-you cards, instruction cards, warranty cards, QR inserts, stickers, filament sample cards, and packaging tape.
- [ ] Define social/marketplace templates for Instagram, Facebook, YouTube thumbnails, MakerWorld, Printables, launch graphics, sale graphics, and STL releases.
- [ ] Cross-reference existing `templates/social/` files.
- [ ] Commit:

```bash
cd /Users/adam/robinson_printworks
git add docs/brand/packaging-system.md docs/brand/social-marketplace-templates.md
git commit -m "docs: define packaging and social templates"
```

---

### Task 6: Final Review

**Files:**

- Create: `docs/brand/brand-review.md`

**Steps:**

- [ ] Review against the brand spec and Brand Guardian skill.
- [ ] Confirm no accidental edits to unrelated user work.
- [ ] Validate locally by opening `index.html` or running:

```bash
cd /Users/adam/robinson_printworks
python3 -m http.server 5173
```

- [ ] Commit review:

```bash
cd /Users/adam/robinson_printworks
git add docs/brand/brand-review.md
git commit -m "docs: add brand review checklist"
```
