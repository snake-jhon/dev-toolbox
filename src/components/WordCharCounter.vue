<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const input = ref('')

const stats = computed(() => {
  const text = input.value
  const trimmed = text.trim()

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length

  const words = trimmed ? trimmed.split(/\s+/).length : 0

  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).filter((s) => s.trim()).length : 0

  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0

  const lines = text ? text.split('\n').length : 0

  // average adult silent reading speed ~200 wpm, speaking speed ~130 wpm
  const readingMinutes = words / 200
  const speakingMinutes = words / 130

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingMinutes,
    speakingMinutes,
  }
})

function formatDuration(minutes) {
  if (minutes < 1 / 60) return '0 sec'
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`
  const whole = Math.floor(minutes)
  const secs = Math.round((minutes - whole) * 60)
  return secs > 0 ? `${whole} min ${secs} sec` : `${whole} min`
}

const topWords = computed(() => {
  const trimmed = input.value.trim()
  if (!trimmed) return []

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'to', 'of', 'in', 'on', 'for', 'with', 'as', 'at', 'by', 'it', 'this', 'that',
    'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their',
  ])

  const counts = {}
  const tokens = trimmed.toLowerCase().match(/[a-z0-9']+/g) || []
  for (const token of tokens) {
    if (stopWords.has(token) || token.length < 2) continue
    counts[token] = (counts[token] || 0) + 1
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))
})

function clear() {
  input.value = ''
}

function loadSample() {
  input.value =
    'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.\n\nUse this tool to check word counts, character counts, and estimated reading time for anything you paste here.'
}

const summaryText = computed(() =>
  `Words: ${stats.value.words} | Characters: ${stats.value.characters} | Characters (no spaces): ${stats.value.charactersNoSpaces} | Sentences: ${stats.value.sentences} | Paragraphs: ${stats.value.paragraphs}`
)
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">06 · Measure</span>
      <h2>Word &amp; Character Counter</h2>
      <p>Paste or type text to see live word, character, sentence, and reading-time stats.</p>
    </div>

    <div>
      <span class="field-label">Text</span>
      <textarea
        v-model="input"
        class="code-area"
        style="min-height: 260px"
        spellcheck="false"
        placeholder="Paste or type text here"
      ></textarea>
      <div class="row" style="margin-top: 10px">
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
        <button class="btn btn-sm" type="button" @click="clear">Clear</button>
        <CopyButton :text="summaryText" label="Copy summary" />
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <span class="field-label">Counts</span>
        <table class="kv-table">
          <tbody>
            <tr><td>Words</td><td>{{ stats.words.toLocaleString() }}</td></tr>
            <tr><td>Characters</td><td>{{ stats.characters.toLocaleString() }}</td></tr>
            <tr><td>Characters (no spaces)</td><td>{{ stats.charactersNoSpaces.toLocaleString() }}</td></tr>
            <tr><td>Sentences</td><td>{{ stats.sentences.toLocaleString() }}</td></tr>
            <tr><td>Paragraphs</td><td>{{ stats.paragraphs.toLocaleString() }}</td></tr>
            <tr><td>Lines</td><td>{{ stats.lines.toLocaleString() }}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <span class="field-label">Reading time</span>
        <table class="kv-table">
          <tbody>
            <tr><td>Silent reading</td><td>{{ formatDuration(stats.readingMinutes) }}</td></tr>
            <tr><td>Reading aloud</td><td>{{ formatDuration(stats.speakingMinutes) }}</td></tr>
          </tbody>
        </table>

        <template v-if="topWords.length">
          <span class="field-label" style="margin-top: 16px">Most frequent words</span>
          <table class="kv-table">
            <tbody>
              <tr v-for="item in topWords" :key="item.word">
                <td>{{ item.word }}</td>
                <td>{{ item.count }}×</td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </section>
</template>
