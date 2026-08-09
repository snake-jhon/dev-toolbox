<script setup>
import { ref, computed } from 'vue'
import { diffLines, diffWords } from 'diff'
import CopyButton from './CopyButton.vue'

const original = ref('')
const changed = ref('')
const ignoreWhitespace = ref(false)

const lineDiff = computed(() => {
  if (!original.value && !changed.value) return []
  return diffLines(original.value, changed.value, { ignoreWhitespace: ignoreWhitespace.value })
})

// pair up adjacent removed/added blocks so we can show a word-level diff within them
const rows = computed(() => {
  const parts = lineDiff.value
  const result = []
  let i = 0
  while (i < parts.length) {
    const part = parts[i]
    if (part.removed && parts[i + 1] && parts[i + 1].added) {
      result.push({ type: 'changed', removedValue: part.value, addedValue: parts[i + 1].value })
      i += 2
    } else if (part.added) {
      result.push({ type: 'added', value: part.value })
      i += 1
    } else if (part.removed) {
      result.push({ type: 'removed', value: part.value })
      i += 1
    } else {
      result.push({ type: 'unchanged', value: part.value })
      i += 1
    }
  }
  return result
})

function wordDiffParts(removedValue, addedValue) {
  return diffWords(removedValue, addedValue)
}

function toLines(value) {
  const lines = value.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

const stats = computed(() => {
  let added = 0
  let removed = 0
  for (const part of lineDiff.value) {
    const count = toLines(part.value).length
    if (part.added) added += count
    else if (part.removed) removed += count
  }
  return { added, removed }
})

const hasDiff = computed(() => stats.value.added > 0 || stats.value.removed > 0)

const unifiedDiff = computed(() => {
  let out = ''
  for (const part of lineDiff.value) {
    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  '
    for (const line of toLines(part.value)) {
      out += prefix + line + '\n'
    }
  }
  return out
})

function clear() {
  original.value = ''
  changed.value = ''
}

function swap() {
  const tmp = original.value
  original.value = changed.value
  changed.value = tmp
}

function loadSample() {
  original.value = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`
  changed.value = `function greet(name, punctuation) {
  console.log(\`Hello, \${name}\${punctuation}\`);
  return true;
}`
}
</script>

<template>
  <section class="tool">
    <div class="tool-pinned">
      <div class="tool-header">
        <span class="eyebrow">09 · Compare</span>
        <h2>Diff Checker</h2>
        <p>Compare two blocks of text line by line, with word-level highlighting inside changed lines.</p>
      </div>

      <div class="row pinned-controls">
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
        <button class="btn btn-sm" type="button" @click="swap">Swap sides</button>
        <button class="btn btn-sm" type="button" @click="clear">Clear</button>
        <label class="row" style="gap: 6px; font-size: 12.5px; color: var(--text-faint)">
          <input v-model="ignoreWhitespace" type="checkbox" style="width: auto; padding: 0" />
          Ignore whitespace
        </label>
        <CopyButton :text="unifiedDiff" label="Copy diff" style="margin-left: auto" />
      </div>
    </div>

    <div class="grid-2">
      <div>
        <span class="field-label">Original</span>
        <textarea v-model="original" class="code-area" style="min-height: 300px" spellcheck="false" placeholder="Paste original text here"></textarea>
      </div>
      <div>
        <span class="field-label">Changed</span>
        <textarea v-model="changed" class="code-area" style="min-height: 300px" spellcheck="false" placeholder="Paste changed text here"></textarea>
      </div>
    </div>

    <div v-if="original || changed" class="status-line" :class="hasDiff ? 'ok' : 'ok'">
      <span v-if="hasDiff">
        <span style="color: var(--ok)">+{{ stats.added }}</span> added ·
        <span style="color: var(--err)">-{{ stats.removed }}</span> removed
      </span>
      <span v-else>✓ No differences</span>
    </div>

    <div v-if="rows.length" class="panel diff-view">
      <template v-for="(row, i) in rows" :key="i">
        <div v-if="row.type === 'unchanged'" class="diff-block">
          <div v-for="(line, j) in toLines(row.value)" :key="j" class="diff-line">
            <span class="diff-gutter"></span>{{ line }}
          </div>
        </div>

        <div v-else-if="row.type === 'removed'" class="diff-block diff-removed">
          <div v-for="(line, j) in toLines(row.value)" :key="j" class="diff-line">
            <span class="diff-gutter">−</span>{{ line }}
          </div>
        </div>

        <div v-else-if="row.type === 'added'" class="diff-block diff-added">
          <div v-for="(line, j) in toLines(row.value)" :key="j" class="diff-line">
            <span class="diff-gutter">+</span>{{ line }}
          </div>
        </div>

        <div v-else class="diff-block">
          <div class="diff-line diff-removed">
            <span class="diff-gutter">−</span>
            <span>
              <template v-for="(w, k) in wordDiffParts(row.removedValue, row.addedValue)" :key="k">
                <span v-if="!w.added" :class="{ 'diff-word-removed': w.removed }">{{ w.value }}</span>
              </template>
            </span>
          </div>
          <div class="diff-line diff-added">
            <span class="diff-gutter">+</span>
            <span>
              <template v-for="(w, k) in wordDiffParts(row.removedValue, row.addedValue)" :key="k">
                <span v-if="!w.removed" :class="{ 'diff-word-added': w.added }">{{ w.value }}</span>
              </template>
            </span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.diff-view {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

.diff-block {
  white-space: pre-wrap;
  word-break: break-word;
}

.diff-line {
  display: flex;
}

.diff-gutter {
  display: inline-block;
  width: 18px;
  flex-shrink: 0;
  color: var(--text-faint);
  user-select: none;
}

.diff-removed {
  background: var(--err-soft);
}

.diff-removed .diff-gutter {
  color: var(--err);
}

.diff-added {
  background: var(--ok-soft);
}

.diff-added .diff-gutter {
  color: var(--ok);
}

.diff-word-removed {
  background: rgba(239, 100, 97, 0.35);
  border-radius: 2px;
}

.diff-word-added {
  background: rgba(79, 209, 165, 0.35);
  border-radius: 2px;
}
</style>
