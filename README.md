# Robinson PrintWorks

A simple one-page website for a personal 3D printing service.

## Customize

Update these placeholders before sharing:

- `Robinson PrintWorks` in `index.html` if you want a different business name
- The quote/footer email `data-user` and `data-domain` attributes in `index.html` if you want a different contact email
- Service copy, materials, pricing, or turnaround details
- Add photos of your prints if you have them

## Preview locally

Open `index.html` in a browser, or run a small local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

The Python server previews static pages only. Testing the quote email endpoint
locally requires `vercel dev` and local values based on `.env.example`.

## Deploy on Vercel

Recommended domain:

```text
printworks.adamrobinson.tech
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
webhook for `https://printworks.adamrobinson.tech/api/resend-webhook`, subscribe
it to sent, delivered, delayed, failed, bounced, complained, and suppressed
events, then add its signing secret as `RESEND_WEBHOOK_SECRET` in Vercel.
