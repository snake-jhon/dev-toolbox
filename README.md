# Dev Toolbox

A minimal, client-side toolbox of everyday developer utilities. No backend required — everything runs in your browser.

**Live app:** https://snake-jhon.github.io/dev-toolbox

## Tools

- **JSON Formatter / Validator** — pretty-print JSON and surface syntax errors with line/column info.
- **Base64 & URL Encoder/Decoder** — toggle between encode and decode for both Base64 and URI components.
- **JWT Decoder** — decode a JWT's header and payload (signature is shown but not verified).
- **Unix Timestamp Converter** — convert between Unix time and human-readable dates, local and UTC.
- **UUID Generator** — generate RFC 4122 v4 UUIDs with one-click copy.
- **Word & Character Counter** — live word, character, sentence, and paragraph counts, plus estimated reading time.
- **Regex Tester** — test patterns against sample text with live match highlighting, capture groups, and a replace preview.
- **Markdown Previewer** — side-by-side Markdown editor and live-rendered HTML preview.
- **Diff Checker** — line-by-line comparison of two blocks of text, with word-level highlighting inside changed lines.
- **QR Code Generator** — turn any text or URL into a downloadable PNG/SVG QR code.

Every tool works entirely client-side: no data is sent to a server, and no external APIs are called.

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) (hash history, so each tool has its own shareable URL)
- [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) for the Markdown previewer
- [diff](https://github.com/kpdecker/jsdiff) for the Diff Checker
- [qrcode](https://github.com/soldair/node-qrcode) for the QR Code Generator
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
    WordCharCounter.vue
    RegexTester.vue
    MarkdownPreviewer.vue
    DiffChecker.vue
    QrCodeGenerator.vue
  router/
    index.js         # route -> tool mapping
  App.vue             # sidebar/tab shell
  main.js
  style.css           # shared design tokens & utility classes
```

## License

MIT
