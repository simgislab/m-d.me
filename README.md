# m-d.me

Content of <https://m-d.me>.

Content edits are welcome as pull-requests.

## Local development

This project is a Hugo site with one npm dependency (`photoswipe`) that is used through the Hugo asset pipeline.

Requirements:

- Hugo Extended `0.160.1` or newer
- Node.js `22` or newer
- npm

Install dependencies:

```bash
npm ci
```

Run the local development server:

```bash
npm run dev
```

The site is usually available at <http://localhost:1313/>.

Build the production version locally:

```bash
npm run build
```

The generated static files are written to `public/`.

Content is licensed under CC-BY-SA 4.0.

Contact: <maxim.dubinin@nextgis.com>
