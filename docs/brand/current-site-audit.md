# Current Website Brand Audit

## Summary

The current Robinson PrintWorks site is already simple, focused, and service-oriented. It has strong local SEO structure, clear calls to action, useful gallery content, and a clean one-page static architecture. The main visual drift is that the design uses magenta/neon variables, glow-heavy shadows, and high-energy gradients that conflict with the preferred premium navy/cyan industrial identity.

This site should be evolved, not replaced. Keep the current page structure and direct copy, but tune the visual language toward understated engineering elegance.

## Keep

- One-page static HTML/CSS architecture.
- Clear local Rhode Island 3D printing positioning.
- Strong SEO metadata, schema, sitemap, robots, and `llms.txt` direction.
- Gallery-led proof of real printed work.
- Direct quote/contact CTA.
- Monospace technical personality.
- Dark mode as the primary visual mode.

## Change

| Area | Current issue | Brand-aligned change | Files/selectors |
| --- | --- | --- | --- |
| Global tokens | `styles.css` uses `--neon`, `--neon-hot`, `--neon-green`, magenta line/shadow variables, and high-glow card shadows. | Add explicit Robinson PrintWorks brand tokens and map existing variables to deep navy, cyan, graphite, and cool neutral values. | `styles.css` `:root` |
| Page background | Body includes cyan, magenta, and green radial glows. | Keep depth, but use deep midnight navy, graphite, and one restrained cyan accent glow. | `styles.css` `body` |
| Logo treatment | Logo uses a magenta drop shadow. | Use a subtle cyan/navy shadow or no glow; make it feel like a premium badge rather than RGB signage. | `styles.css` `.logo img` |
| Headline gradient | `h1` ends in neon magenta with a magenta text shadow. | Use soft white to cool blue/cyan gradient; remove magenta glow. | `styles.css` `h1` |
| Buttons | Button hover/primary treatments use neon-green and magenta language. | Use royal navy/cyan as precision accent, with calmer hover states. | `styles.css` `.button`, `.button-primary`, `.button-secondary` |
| Cards/panels | Cards use neon border/shadow variables and energetic hover glow. | Use subtle navy panels, cool-gray borders, restrained cyan hover edge. | `styles.css` `.card`, `.proof-card`, `.gallery-card`, `.quote-card`, `.faq-item` |
| Product/gallery presentation | Existing gallery is useful, but the surrounding UI does not yet establish a unified product-family language. | Add future photography guidance: dark studio, soft reflections, cyan accent detail, consistent crops. | `images/`, `docs/brand/product-render-prompts.md` |
| Copy/name consistency | README and metadata use `Printworks`; the desired brand direction uses `PrintWorks`. | Standardize future brand-facing copy to `Robinson PrintWorks`; update existing HTML only after reviewing the user’s current `index.html` changes. | `README.md`, `index.html`, metadata/schema |
| Social templates | Existing templates are marketplace/local-service focused, not yet tied to the new visual system. | Add reusable social/marketplace template specs using the navy/cyan product photography system. | `templates/social/`, `docs/brand/social-marketplace-templates.md` |

## Priority Order

1. Add brand governance docs and Brand Guardian skill.
2. Add site-specific brand audit and implementation plan.
3. Update `styles.css` tokens and visual effects to remove magenta/RGB drift.
4. Review the user’s current `index.html` changes before touching copy/metadata.
5. Add product render, photography, packaging, and social template docs.
6. Generate/replace visual assets only after the identity direction is approved.

## Brand Guardian Review

**Brand fit:** The site has the right clean local-service foundation, but the visual layer needs to move from neon maker energy to premium engineered navy/cyan consistency.

**Spec alignment:**

- Color: replace magenta/green neon accents with deep navy, graphite, soft white, and restrained cyan.
- Form: preserve rounded cards and clear sections, but reduce glow intensity.
- Photography: keep real product proof, then evolve gallery/OG/social images toward controlled dark studio product photography.
- Ecosystem: ensure the website, product renders, packaging, and marketplace assets all use the same navy/cyan precision-detailing system.

**Risks:** A pure SaaS restyle would lose the maker warmth; keeping the current neon palette would undermine the premium industrial direction.

**Next adjustment:** Update `styles.css` tokens first, because that improves the whole site without touching the user’s in-progress `index.html` edits.
