<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const pattern = ref('')
const testString = ref('')
const replacement = ref('')

const flagOptions = [
  { key: 'g', label: 'g', title: 'global — find all matches' },
  { key: 'i', label: 'i', title: 'ignore case' },
  { key: 'm', label: 'm', title: 'multiline — ^ and $ match line boundaries' },
  { key: 's', label: 's', title: 'dot matches newline' },
  { key: 'u', label: 'u', title: 'unicode' },
  { key: 'y', label: 'y', title: 'sticky' },
]
const activeFlags = ref(new Set(['g']))

function toggleFlag(key) {
  const next = new Set(activeFlags.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  activeFlags.value = next
}

const flagsString = computed(() => flagOptions.map((f) => f.key).filter((k) => activeFlags.value.has(k)).join(''))

const regexResult = computed(() => {
  if (!pattern.value) return { ok: null, regex: null, error: '' }
  try {
    const regex = new RegExp(pattern.value, flagsString.value)
    return { ok: true, regex, error: '' }
  } catch (e) {
    return { ok: false, regex: null, error: e.message }
  }
})

const matches = computed(() => {
  if (!regexResult.value.ok || !testString.value) return []
  const { regex } = regexResult.value
  const results = []

  if (regex.global || regex.sticky) {
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
    let m
    let guard = 0
    while ((m = re.exec(testString.value)) !== null && guard < 5000) {
      results.push(m)
      if (m[0] === '') re.lastIndex++
      guard++
    }
  } else {
    const m = regex.exec(testString.value)
    if (m) results.push(m)
  }
  return results
})

// build highlighted HTML (escaped) with <mark> around each match
const highlighted = computed(() => {
  const text = testString.value
  if (!text) return ''
  if (!matches.value.length) return escapeHtml(text)

  let out = ''
  let cursor = 0
  for (const m of matches.value) {
    const start = m.index
    const end = start + m[0].length
    if (start < cursor) continue // overlapping safety guard
    out += escapeHtml(text.slice(cursor, start))
    out += `<mark>${escapeHtml(text.slice(start, end) || ' ')}</mark>`
    cursor = end
  }
  out += escapeHtml(text.slice(cursor))
  return out
})

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const replaced = computed(() => {
  if (!regexResult.value.ok || !testString.value) return { ok: null, output: '', error: '' }
  try {
    const output = testString.value.replace(regexResult.value.regex, replacement.value)
    return { ok: true, output, error: '' }
  } catch (e) {
    return { ok: false, output: '', error: e.message }
  }
})

function loadSample() {
  pattern.value = '(\\w+)@(\\w+)\\.(\\w+)'
  activeFlags.value = new Set(['g', 'i'])
  testString.value = 'Contact us at support@example.com or sales@example.org for help.'
  replacement.value = '[email hidden]'
}

function clear() {
  pattern.value = ''
  testString.value = ''
  replacement.value = ''
}
</script>

<template>
  <section class="tool">
    <div class="tool-pinned">
      <div class="tool-header">
        <span class="eyebrow">07 · Test</span>
        <h2>Regex Tester</h2>
        <p>Build and test regular expressions against sample text, with live match highlighting and replace preview.</p>
      </div>

      <div class="pinned-controls">
        <span class="field-label">Pattern</span>
        <div class="row">
          <span style="font-family: var(--mono); color: var(--text-faint)">/</span>
          <input v-model="pattern" type="text" placeholder="\\w+@\\w+\\.\\w+" style="flex: 1" spellcheck="false" />
          <span style="font-family: var(--mono); color: var(--text-faint)">/{{ flagsString }}</span>
        </div>
        <div class="row" style="margin-top: 10px">
          <button
            v-for="flag in flagOptions"
            :key="flag.key"
            class="btn btn-sm"
            type="button"
            :class="{ 'btn-primary': activeFlags.has(flag.key) }"
            :title="flag.title"
            @click="toggleFlag(flag.key)"
          >
            {{ flag.label }}
          </button>
          <button class="btn btn-sm" type="button" style="margin-left: auto" @click="loadSample">Load sample</button>
          <button class="btn btn-sm" type="button" @click="clear">Clear</button>
        </div>
      </div>

      <div v-if="regexResult.ok === false" class="status-line err pinned-controls">✕ Invalid pattern: {{ regexResult.error }}</div>
      <div v-else-if="regexResult.ok === true" class="status-line ok pinned-controls">
        ✓ Valid pattern · {{ matches.length }} match{{ matches.length === 1 ? '' : 'es' }}
      </div>
    </div>

    <div>
      <span class="field-label">Test string</span>
      <textarea
        v-model="testString"
        class="code-area"
        style="min-height: 140px"
        spellcheck="false"
        placeholder="Paste text to test against your pattern"
      ></textarea>
    </div>

    <div v-if="testString" class="panel">
      <span class="field-label">Highlighted matches</span>
      <div class="highlight-box" v-html="highlighted"></div>
    </div>

    <div v-if="matches.length" class="panel">
      <span class="field-label">Match details</span>
      <table class="kv-table">
        <tbody>
          <tr v-for="(m, i) in matches" :key="i">
            <td>#{{ i + 1 }} @ {{ m.index }}</td>
            <td>
              <code>{{ m[0] }}</code>
              <span v-if="m.length > 1" style="color: var(--text-faint)">
                — groups: {{ m.slice(1).map((g) => g ?? '∅').join(', ') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <span class="field-label">Replace with</span>
      <div class="row">
        <input v-model="replacement" type="text" placeholder="$1 or plain text" style="flex: 1" spellcheck="false" />
      </div>
      <textarea
        class="code-area"
        style="min-height: 100px; margin-top: 10px"
        readonly
        spellcheck="false"
        :value="replaced.output"
        placeholder="Replacement result will appear here"
      ></textarea>
      <div class="row" style="margin-top: 10px">
        <CopyButton :text="replaced.output" label="Copy result" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlight-box {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.highlight-box :deep(mark) {
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 3px;
  padding: 0 2px;
}

code {
  font-family: var(--mono);
  color: var(--text-primary);
}
</style>
