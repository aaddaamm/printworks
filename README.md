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

## Deploy on Vercel

Recommended domain:

```text
printworks.adamrobinson.tech
```

This site is static HTML/CSS and can be imported directly into Vercel.
The `vercel.json` file adds clean URLs and basic security/cache headers.
