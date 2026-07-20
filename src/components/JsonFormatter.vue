<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const input = ref('')
const indent = ref(2)

const result = computed(() => {
  if (!input.value.trim()) {
    return { ok: null, output: '', error: '' }
  }
  try {
    const parsed = JSON.parse(input.value)
    return {
      ok: true,
      output: JSON.stringify(parsed, null, Number(indent.value)),
      error: '',
    }
  } catch (e) {
    return { ok: false, output: '', error: describeError(e, input.value) }
  }
})

function describeError(e, source) {
  const msg = e.message || 'Invalid JSON'
  // modern engines already append "(line X column Y)" — don't duplicate it
  if (/line \d+/.test(msg)) return msg

  const posMatch = msg.match(/position (\d+)/)
  if (!posMatch) return msg

  const pos = Number(posMatch[1])
  const before = source.slice(0, pos)
  const line = before.split('\n').length
  const col = pos - before.lastIndexOf('\n')
  return `${msg} (line ${line}, column ${col})`
}

function minify() {
  if (result.value.ok === false || !input.value.trim()) return
  try {
    input.value = JSON.stringify(JSON.parse(input.value))
  } catch {
    /* no-op, invalid JSON already surfaced */
  }
}

function clear() {
  input.value = ''
}

function loadSample() {
  input.value = JSON.stringify({
    name: 'dev-toolbox',
    version: 1,
    tags: ['json', 'utility', 'client-side'],
    active: true,
    meta: { author: null, stars: 0 },
  })
}
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">01 · Validate</span>
      <h2>JSON Formatter &amp; Validator</h2>
      <p>Paste JSON to pretty-print it and check for syntax errors. Nothing leaves your browser.</p>
    </div>

    <div class="grid-2">
      <div>
        <span class="field-label">Input</span>
        <textarea
          v-model="input"
          class="code-area"
          spellcheck="false"
          placeholder='{"paste":"your JSON here"}'
        ></textarea>
        <div class="row" style="margin-top: 10px">
          <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
          <button class="btn btn-sm" type="button" @click="minify" :disabled="result.ok !== true">Minify in place</button>
          <button class="btn btn-sm" type="button" @click="clear">Clear</button>
          <label class="row" style="gap: 6px; margin-left: auto; color: var(--text-faint); font-size: 12px">
            Indent
            <select v-model="indent" style="padding: 4px 8px; font-size: 12px">
              <option :value="2">2</option>
              <option :value="4">4</option>
              <option :value="0">tabs off (compact)</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <span class="field-label">Output</span>
        <textarea class="code-area" readonly spellcheck="false" :value="result.output" placeholder="Formatted JSON will appear here"></textarea>
        <div class="row" style="margin-top: 10px">
          <CopyButton :text="result.output" label="Copy formatted JSON" />
        </div>
      </div>
    </div>

    <div v-if="result.ok === true" class="status-line ok">✓ Valid JSON</div>
    <div v-else-if="result.ok === false" class="status-line err">✕ {{ result.error }}</div>
  </section>
</template>
