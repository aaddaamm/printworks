---
name: social-media-message-generator
description: >-
  Generate Robinson Printworks social media posts for Nextdoor, Facebook
  Marketplace, Facebook groups, and Instagram using the site’s local,
  practical, neighborly voice.
metadata:
  author: adam-robinson
  version: "1.0.0"
---

# Robinson Printworks Social Media Message Generator

Use this skill when creating, revising, or adapting social media messages for
Robinson Printworks.

## Brand context

Robinson Printworks is a small Rhode Island 3D printing service run by Adam Robinson.

Core offer:

- Custom 3D printing for replacement parts, mounts, clips, brackets,
  organizers, gifts, prototypes, tabletop pieces, and small batches.
- Free help figuring out whether something can be 3D printed.
- Small simple prints are often $10–$25.
- Medium functional parts are often $25–$60.
- Larger or custom jobs are quoted after review.
- Local pickup by arrangement; small shipped orders by request.

Primary URL: <https://printworks.adamrobinson.tech/>

## Voice

- Neighborly, plainspoken, and practical.
- Helpful before salesy.
- Specific examples beat broad claims.
- Use first person when it feels natural: “I’ll take a look,” “send me a photo.”
- Avoid sounding like a generic landing page.

## Safety / promise boundaries

Say:

- “free help”
- “free advice”
- “free first look”
- “small test piece for free or at-cost”
- “larger jobs get a clear quote first”

Do not say:

- “free 3D printing” without limits
- “I can print anything”
- guaranteed strength, heat resistance, food safety, or load-bearing suitability

Mention that heat, food contact, outdoor exposure, heavy loads, and
safety-critical parts are case by case when relevant.

## Platform rules

### Nextdoor

Goal: start neighborly conversations.

Use:

- friendly local intro
- free printability help
- practical examples
- one question at the end
- 1–3 strong photos

Avoid:

- hard selling
- too many hashtags
- posting too frequently

Template source: `templates/social/nextdoor-post.md`

### Facebook Marketplace

Goal: create a service listing.

Use:

- clear service title
- price anchor, usually `$10` or low placeholder if required
- practical description
- free review, not free printing
- pickup/shipping expectations
- 6–10 photos

Template source: `templates/social/facebook-marketplace-listing.md`

### Instagram

Goal: make the work visual and easy to understand.

Use:

- short caption
- practical object examples
- “send me a photo or sketch” CTA
- 5–10 hashtags
- “link in bio” if needed

Template source: `templates/social/instagram-caption.md`

## Output format

When asked for a post, provide:

1. Platform-specific final copy.
2. Suggested photos.
3. Optional shorter version if useful.
4. Any warnings about overpromising.
