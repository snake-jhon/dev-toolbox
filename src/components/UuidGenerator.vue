<script setup>
import { ref } from 'vue'
import CopyButton from './CopyButton.vue'

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // fallback RFC4122 v4 generator using crypto.getRandomValues
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

const count = ref(1)
const uppercase = ref(false)
const hyphens = ref(true)
const list = ref([generateUuid()])

function format(id) {
  let out = hyphens.value ? id : id.replace(/-/g, '')
  return uppercase.value ? out.toUpperCase() : out
}

function regenerate() {
  const n = Math.min(Math.max(Number(count.value) || 1, 1), 100)
  list.value = Array.from({ length: n }, () => generateUuid())
}

const allText = () => list.value.map(format).join('\n')
</script>

<template>
  <section class="tool">
    <div class="tool-header">
      <span class="eyebrow">05 · Generate</span>
      <h2>UUID Generator</h2>
      <p>Generate RFC 4122 version 4 UUIDs using your browser's cryptographically secure random source.</p>
    </div>

    <div class="row">
      <label class="row" style="gap: 6px; font-size: 12.5px; color: var(--text-faint)">
        Count
        <input v-model="count" type="number" min="1" max="100" style="width: 70px" />
      </label>
      <div class="chip-toggle">
        <button type="button" :class="{ active: hyphens }" @click="hyphens = true">with hyphens</button>
        <button type="button" :class="{ active: !hyphens }" @click="hyphens = false">no hyphens</button>
      </div>
      <div class="chip-toggle">
        <button type="button" :class="{ active: !uppercase }" @click="uppercase = false">lowercase</button>
        <button type="button" :class="{ active: uppercase }" @click="uppercase = true">UPPERCASE</button>
      </div>
      <button class="btn btn-primary btn-sm" type="button" @click="regenerate">Generate</button>
    </div>

    <div class="panel">
      <div
        v-for="(id, i) in list"
        :key="i"
        class="row"
        style="justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-soft)"
      >
        <span style="font-family: var(--mono); font-size: 13.5px">{{ format(id) }}</span>
        <CopyButton :text="format(id)" label="Copy" />
      </div>
    </div>

    <div class="row" v-if="list.length > 1">
      <CopyButton :text="allText()" label="Copy all" />
    </div>
  </section>
</template>
