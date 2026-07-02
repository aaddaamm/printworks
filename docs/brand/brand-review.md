# Brand Review

## Reviewed Against

- `docs/superpowers/specs/2026-07-02-robinson-printworks-brand-identity-design.md`
- `.claude/skills/brand-guardian/SKILL.md`
- `docs/brand/current-site-audit.md`

## Current Brand Fit

The site now has a stronger foundation for the Robinson PrintWorks identity: deep navy/graphite surfaces, restrained cyan detail, reduced glow intensity, and supporting docs for product renders, packaging, and social templates.

## Completed This Pass

- Added source-of-truth brand identity spec.
- Added project-level Brand Guardian skill.
- Added site-specific brand audit.
- Added corrected implementation plan for the static dotcom repo.
- Updated `styles.css` away from magenta/RGB/neon drift and toward navy/cyan precision detailing.
- Added product render and photography prompt pack.
- Added packaging system spec.
- Added social and marketplace template spec.

## Checklist

- [x] Navy/cyan system is documented.
- [x] Cyan is defined as precision detailing, not decoration.
- [x] Current CSS no longer uses the prior magenta/green neon literals.
- [x] Website, mockup, packaging, and social directions are connected.
- [x] The printer is treated as a tool, not the brand centerpiece.
- [x] Copy guidance avoids unsupported claims.
- [x] Brand Guardian skill exists for future reviews.

## Known Open Items

- Review the existing uncommitted `index.html` changes before editing copy or metadata.
- Standardize visible naming from `Robinson Printworks` to `Robinson PrintWorks` where appropriate.
- Review `llms.txt` before deciding whether to commit it.
- Generate actual visual identity boards from `docs/brand/product-render-prompts.md`.
- Compare logo/mark options at 20 mm before changing physical or favicon assets.
- Update social templates in `templates/social/` after copy naming is settled.

## Brand Guardian Summary

**Brand fit:** The repo now has the right governance and the CSS has moved materially closer to the preferred premium engineering direction.

**Spec alignment:** The implemented style pass emphasizes deep navy, graphite, soft white, and restrained cyan while preserving the current one-page structure.

**Risks:** Existing uncommitted `index.html` work may still contain old `Printworks` casing or visual/copy assumptions; review before touching it.

**Next adjustment:** Review `index.html` diff, then make a focused copy/metadata pass that preserves local SEO and user edits.
