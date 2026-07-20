# Dev Toolbox

A minimal, client-side toolbox of everyday developer utilities. No backend required — everything runs in your browser.

## Tools

- **JSON Formatter / Validator** — pretty-print JSON and surface syntax errors with line/column info.
- **Base64 & URL Encoder/Decoder** — toggle between encode and decode for both Base64 and URI components.
- **JWT Decoder** — decode a JWT's header and payload (signature is shown but not verified).
- **Unix Timestamp Converter** — convert between Unix time and human-readable dates, local and UTC.
- **UUID Generator** — generate RFC 4122 v4 UUIDs with one-click copy.

Every tool works entirely client-side: no data is sent to a server, and no external APIs are called.

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) (hash history, so each tool has its own shareable URL)
- Plain CSS (no UI framework)

## Local development

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check & build for production
npm run build

# preview the production build locally
npm run preview
```

## Deployment

The app is deployed automatically to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`. The workflow builds the Vite app and publishes the `dist/` output using `actions/deploy-pages`.

`vite.config.js` sets `base: '/dev-toolbox/'` so built asset URLs resolve correctly under the repository's Pages path.

## Project structure

```
src/
  components/       # one component per tool
    CopyButton.vue
    JsonFormatter.vue
    Base64UrlEncoder.vue
    JwtDecoder.vue
    TimestampConverter.vue
    UuidGenerator.vue
  router/
    index.js         # route -> tool mapping
  App.vue             # sidebar/tab shell
  main.js
  style.css           # shared design tokens & utility classes
```

## License

MIT
