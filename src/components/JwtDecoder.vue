<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const input = ref('')

function b64UrlToUtf8(segment) {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
  return decodeURIComponent(escape(atob(padded)))
}

function tryFormatDate(value) {
  if (typeof value !== 'number') return null
  const date = new Date(value * 1000)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().replace('T', ' ').replace('Z', ' UTC')
}

const decoded = computed(() => {
  const token = input.value.trim()
  if (!token) return { ok: null, header: null, payload: null, signature: '', error: '' }

  const parts = token.split('.')
  if (parts.length < 2) {
    return { ok: false, header: null, payload: null, signature: '', error: 'A JWT needs at least a header and payload segment separated by dots.' }
  }

  try {
    const header = JSON.parse(b64UrlToUtf8(parts[0]))
    const payload = JSON.parse(b64UrlToUtf8(parts[1]))
    return {
      ok: true,
      header,
      payload,
      signature: parts[2] || '',
      error: '',
    }
  } catch (e) {
    return { ok: false, header: null, payload: null, signature: '', error: `Could not decode token: ${e.message}` }
  }
})

const claimNotes = computed(() => {
  if (!decoded.value.ok) return []
  const p = decoded.value.payload
  const notes = []
  if (p.exp) notes.push({ key: 'exp', label: 'Expires', value: tryFormatDate(p.exp) })
  if (p.iat) notes.push({ key: 'iat', label: 'Issued at', value: tryFormatDate(p.iat) })
  if (p.nbf) notes.push({ key: 'nbf', label: 'Not before', value: tryFormatDate(p.nbf) })
  return notes.filter((n) => n.value)
})

const headerJson = computed(() => (decoded.value.header ? JSON.stringify(decoded.value.header, null, 2) : ''))
const payloadJson = computed(() => (decoded.value.payload ? JSON.stringify(decoded.value.payload, null, 2) : ''))

function loadSample() {
  input.value =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
}

function clear() {
  input.value = ''
}
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">03 · Inspect</span>
      <h2>JWT Decoder</h2>
      <p>Decode the header and payload of a JSON Web Token. Signature is shown but not verified.</p>
    </div>

    <div>
      <span class="field-label">Token</span>
      <textarea
        v-model="input"
        class="code-area"
        style="min-height: 100px"
        spellcheck="false"
        placeholder="eyJhbGciOiJIUzI1NiIs..."
      ></textarea>
      <div class="row" style="margin-top: 10px">
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample token</button>
        <button class="btn btn-sm" type="button" @click="clear">Clear</button>
      </div>
    </div>

    <div v-if="decoded.ok === false" class="status-line err">✕ {{ decoded.error }}</div>

    <template v-if="decoded.ok">
      <div class="grid-2">
        <div>
          <span class="field-label">Header</span>
          <textarea class="code-area" style="min-height: 140px" readonly :value="headerJson"></textarea>
          <div class="row" style="margin-top: 10px">
            <CopyButton :text="headerJson" label="Copy header" />
          </div>
        </div>
        <div>
          <span class="field-label">Payload</span>
          <textarea class="code-area" style="min-height: 140px" readonly :value="payloadJson"></textarea>
          <div class="row" style="margin-top: 10px">
            <CopyButton :text="payloadJson" label="Copy payload" />
          </div>
        </div>
      </div>

      <div v-if="claimNotes.length" class="panel">
        <span class="field-label">Time claims</span>
        <table class="kv-table">
          <tbody>
            <tr v-for="note in claimNotes" :key="note.key">
              <td>{{ note.label }} ({{ note.key }})</td>
              <td>{{ note.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="decoded.signature" class="panel">
        <span class="field-label">Signature (unverified)</span>
        <div style="font-family: var(--mono); font-size: 12.5px; word-break: break-all; color: var(--text-muted)">
          {{ decoded.signature }}
        </div>
      </div>
    </template>
  </section>
</template>
