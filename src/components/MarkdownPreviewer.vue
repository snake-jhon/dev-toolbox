<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import CopyButton from './CopyButton.vue'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const input = ref('')

const renderedHtml = computed(() => {
  if (!input.value.trim()) return ''
  const raw = marked.parse(input.value)
  return DOMPurify.sanitize(raw)
})

function clear() {
  input.value = ''
}

function loadSample() {
  input.value = `# Dev Toolbox

A minimal, **client-side** toolbox of everyday developer utilities.

## Features

- No backend required
- Everything runs *in your browser*
- Supports \`inline code\` and fenced blocks

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

> Tip: paste your own Markdown on the left to see it rendered here.

| Tool | Purpose |
| --- | --- |
| JSON Formatter | Validate & pretty-print |
| Regex Tester | Match & replace |

[Learn more about Markdown](https://www.markdownguide.org/)
`
}
</script>

<template>
  <section class="tool" style="max-width: none">
    <div class="tool-pinned">
      <div class="tool-header">
        <span class="eyebrow">08 · Preview</span>
        <h2>Markdown Previewer</h2>
        <p>Write or paste Markdown on the left and see the rendered HTML update live on the right.</p>
      </div>

      <div class="row pinned-controls">
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
        <button class="btn btn-sm" type="button" @click="clear">Clear</button>
        <CopyButton :text="renderedHtml" label="Copy rendered HTML" />
      </div>
    </div>

    <div class="split">
      <div class="pane">
        <span class="field-label">Markdown</span>
        <textarea
          v-model="input"
          class="code-area split-area"
          spellcheck="false"
          placeholder="# Start typing Markdown here"
        ></textarea>
      </div>

      <div class="pane">
        <span class="field-label">Preview</span>
        <div class="panel markdown-preview split-area">
          <div v-if="renderedHtml" v-html="renderedHtml"></div>
          <p v-else style="color: var(--text-faint); font-size: 13px">Rendered output will appear here.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .split {
    grid-template-columns: 1fr;
  }
}

.split-area {
  min-height: 420px;
}

.pane {
  display: flex;
  flex-direction: column;
}

.markdown-preview {
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  font-family: var(--mono);
  color: var(--text-primary);
  margin: 1.2em 0 0.5em;
}

.markdown-preview :deep(h1:first-child),
.markdown-preview :deep(h2:first-child),
.markdown-preview :deep(h3:first-child) {
  margin-top: 0;
}

.markdown-preview :deep(p) {
  color: var(--text-primary);
  margin: 0.6em 0;
}

.markdown-preview :deep(a) {
  color: var(--accent);
}

.markdown-preview :deep(code) {
  font-family: var(--mono);
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  overflow-x: auto;
}

.markdown-preview :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
}

.markdown-preview :deep(blockquote) {
  border-left: 3px solid var(--accent-dim);
  margin: 0.8em 0;
  padding: 2px 14px;
  color: var(--text-muted);
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  color: var(--text-primary);
  padding-left: 1.4em;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9em;
  margin: 0.8em 0;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid var(--border);
  padding: 6px 10px;
  text-align: left;
}

.markdown-preview :deep(th) {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.markdown-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-soft);
  margin: 1.4em 0;
}

.markdown-preview :deep(img) {
  max-width: 100%;
}
</style>
