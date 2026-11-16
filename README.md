# Robinson PrintWorks

A simple one-page website for a personal 3D printing service.

## Page templates

Edit the source under `site/` for changes to the homepage and quote page.

- `site/components/home/` contains each homepage section.
- `site/index.template.html` defines the homepage layout.
- `site/quote.template.html` holds the quote page and form.
- `site/components/head-assets.html` and `browser-scripts.html` hold the
  shared icon links, font preload, browser logger, and analytics setup.

Run `npm run build` after editing a template or component. Commit the generated
`index.html` and `quote/index.html` when they change. `npm run build:check`
verifies both files are current.

## Preview locally

Build the pages and start a local server:

```bash
npm run dev
```

Then visit `http://localhost:5173`.

The Python server previews static pages only. Testing the quote email endpoint
locally requires `vercel dev` and local values based on `.env.example`.

## Deploy on Vercel

Recommended domain:

```text
robinsonprintworks.com
```

This site is static HTML/CSS and can be imported directly into Vercel.
The `vercel.json` file adds clean URLs and basic security/cache headers.

## Browser logging

`logger.js` provides structured `debug`, `info`, `warn`, and `error` logging,
keeps the latest 100 entries in memory, and captures uncaught errors and rejected
promises. Debug and info messages appear in the browser console on localhost or
when the page URL includes `?debug`; warnings and errors always appear.

Inspect recent entries with `window.logger.getHistory()`. Context properties that
look like personal information or credentials are redacted automatically.

## Quote email delivery

The quote form posts to the Vercel Function at `/api/quote`, which sends the
request through Resend. Configure `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, and
optionally `QUOTE_TO_EMAIL` in Vercel using `.env.example` as a reference.

The send endpoint logs an `email_accepted` or failure event without logging the
customer's personal information. To record final delivery events, create a Resend
webhook for `https://robinsonprintworks.com/api/resend-webhook`, subscribe
it to sent, delivered, delayed, failed, bounced, complained, and suppressed
events, then add its signing secret as `RESEND_WEBHOOK_SECRET` in Vercel.
