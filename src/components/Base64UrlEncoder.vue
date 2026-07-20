<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const mode = ref('base64') // 'base64' | 'url'
const direction = ref('encode') // 'encode' | 'decode'
const input = ref('')

function utf8ToB64(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

function b64ToUtf8(str) {
  return decodeURIComponent(escape(atob(str)))
}

const result = computed(() => {
  if (!input.value) return { ok: null, output: '', error: '' }

  try {
    if (mode.value === 'base64') {
      const output = direction.value === 'encode' ? utf8ToB64(input.value) : b64ToUtf8(input.value)
      return { ok: true, output, error: '' }
    } else {
      const output =
        direction.value === 'encode' ? encodeURIComponent(input.value) : decodeURIComponent(input.value)
      return { ok: true, output, error: '' }
    }
  } catch (e) {
    const label = mode.value === 'base64' ? 'Base64' : 'URL'
    return { ok: false, output: '', error: `Could not decode as ${label}: ${e.message}` }
  }
})

function swap() {
  direction.value = direction.value === 'encode' ? 'decode' : 'encode'
  if (result.value.ok) {
    input.value = result.value.output
  }
}

function clear() {
  input.value = ''
}
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">02 · Transform</span>
      <h2>Base64 &amp; URL Encoder / Decoder</h2>
      <p>Switch encoding type and direction, then paste text to transform it instantly.</p>
    </div>

    <div class="row">
      <div class="chip-toggle">
        <button type="button" :class="{ active: mode === 'base64' }" @click="mode = 'base64'">Base64</button>
        <button type="button" :class="{ active: mode === 'url' }" @click="mode = 'url'">URL</button>
      </div>
      <div class="chip-toggle">
        <button type="button" :class="{ active: direction === 'encode' }" @click="direction = 'encode'">Encode</button>
        <button type="button" :class="{ active: direction === 'decode' }" @click="direction = 'decode'">Decode</button>
      </div>
      <button class="btn btn-sm" type="button" @click="swap" :disabled="result.ok !== true">
        Use output as input &amp; flip
      </button>
      <button class="btn btn-sm" type="button" @click="clear">Clear</button>
    </div>

    <div class="grid-2">
      <div>
        <span class="field-label">{{ direction === 'encode' ? 'Plain text' : (mode === 'base64' ? 'Base64 string' : 'Encoded URI') }}</span>
        <textarea v-model="input" class="code-area" spellcheck="false" placeholder="Paste text here"></textarea>
      </div>

      <div>
        <span class="field-label">{{ direction === 'encode' ? (mode === 'base64' ? 'Base64 string' : 'Encoded URI') : 'Plain text' }}</span>
        <textarea class="code-area" readonly spellcheck="false" :value="result.output" placeholder="Result will appear here"></textarea>
        <div class="row" style="margin-top: 10px">
          <CopyButton :text="result.output" label="Copy result" />
        </div>
      </div>
    </div>

    <div v-if="result.ok === false" class="status-line err">✕ {{ result.error }}</div>
  </section>
</template>
