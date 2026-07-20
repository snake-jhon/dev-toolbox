<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CopyButton from './CopyButton.vue'

const now = ref(Math.floor(Date.now() / 1000))
let timer = null
onMounted(() => {
  timer = setInterval(() => (now.value = Math.floor(Date.now() / 1000)), 1000)
})
onUnmounted(() => clearInterval(timer))

// --- timestamp -> date ---
const tsInput = ref(String(Math.floor(Date.now() / 1000)))
const tsUnit = ref('seconds') // 'seconds' | 'milliseconds'

const tsResult = computed(() => {
  const raw = tsInput.value.trim()
  if (!raw) return { ok: null, date: null, error: '' }
  if (!/^-?\d+$/.test(raw)) return { ok: false, date: null, error: 'Enter an integer timestamp.' }

  const num = Number(raw)
  const ms = tsUnit.value === 'seconds' ? num * 1000 : num
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return { ok: false, date: null, error: 'Timestamp is out of range.' }
  return { ok: true, date, error: '' }
})

function formatLocal(date) {
  return date.toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
}

function formatUtc(date) {
  return date.toUTCString()
}

function formatIso(date) {
  return date.toISOString()
}

function relativeToNow(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSec)
  const units = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60], ['second', 1],
  ]
  for (const [name, secs] of units) {
    if (abs >= secs || name === 'second') {
      const val = Math.round(abs / secs)
      const suffix = diffSec >= 0 ? 'from now' : 'ago'
      return `${val} ${name}${val !== 1 ? 's' : ''} ${suffix}`
    }
  }
  return ''
}

// --- date -> timestamp ---
const dateInput = ref(new Date().toISOString().slice(0, 19))

const dateResult = computed(() => {
  if (!dateInput.value) return { ok: null, seconds: null, ms: null, error: '' }
  const date = new Date(dateInput.value)
  if (Number.isNaN(date.getTime())) return { ok: false, seconds: null, ms: null, error: 'Could not parse that date/time.' }
  return { ok: true, seconds: Math.floor(date.getTime() / 1000), ms: date.getTime(), error: '' }
})

function useNow() {
  tsInput.value = String(Math.floor(Date.now() / 1000))
  tsUnit.value = 'seconds'
}
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">04 · Convert</span>
      <h2>Unix Timestamp Converter</h2>
      <p>Convert between Unix time and human-readable dates, in both local time and UTC.</p>
    </div>

    <div class="panel row" style="justify-content: space-between">
      <span class="field-label" style="margin: 0">Current time</span>
      <div style="font-family: var(--mono); font-size: 13px">
        {{ now }} <span style="color: var(--text-faint)">·</span> {{ formatLocal(new Date(now * 1000)) }}
      </div>
    </div>

    <div class="grid-2">
      <div>
        <span class="field-label">Timestamp → date</span>
        <div class="row" style="margin-bottom: 8px">
          <input v-model="tsInput" type="text" inputmode="numeric" placeholder="1700000000" style="flex: 1" />
          <div class="chip-toggle">
            <button type="button" :class="{ active: tsUnit === 'seconds' }" @click="tsUnit = 'seconds'">sec</button>
            <button type="button" :class="{ active: tsUnit === 'milliseconds' }" @click="tsUnit = 'milliseconds'">ms</button>
          </div>
        </div>
        <button class="btn btn-sm" type="button" @click="useNow">Use current time</button>

        <div v-if="tsResult.ok === false" class="status-line err" style="margin-top: 10px">✕ {{ tsResult.error }}</div>

        <div v-if="tsResult.ok" class="panel" style="margin-top: 10px">
          <table class="kv-table">
            <tbody>
              <tr><td>Local</td><td>{{ formatLocal(tsResult.date) }}</td></tr>
              <tr><td>UTC</td><td>{{ formatUtc(tsResult.date) }}</td></tr>
              <tr><td>ISO 8601</td><td>{{ formatIso(tsResult.date) }}</td></tr>
              <tr><td>Relative</td><td>{{ relativeToNow(tsResult.date) }}</td></tr>
            </tbody>
          </table>
          <div class="row" style="margin-top: 10px">
            <CopyButton :text="formatIso(tsResult.date)" label="Copy ISO 8601" />
          </div>
        </div>
      </div>

      <div>
        <span class="field-label">Date → timestamp</span>
        <input v-model="dateInput" type="datetime-local" step="1" style="width: 100%; margin-bottom: 8px" />
        <p style="font-size: 12px">Interpreted in your browser's local timezone.</p>

        <div v-if="dateResult.ok === false" class="status-line err" style="margin-top: 10px">✕ {{ dateResult.error }}</div>

        <div v-if="dateResult.ok" class="panel" style="margin-top: 10px">
          <table class="kv-table">
            <tbody>
              <tr><td>Seconds</td><td>{{ dateResult.seconds }}</td></tr>
              <tr><td>Milliseconds</td><td>{{ dateResult.ms }}</td></tr>
            </tbody>
          </table>
          <div class="row" style="margin-top: 10px">
            <CopyButton :text="String(dateResult.seconds)" label="Copy seconds" />
            <CopyButton :text="String(dateResult.ms)" label="Copy ms" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
