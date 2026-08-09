<script setup>
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

const text = ref('https://github.com/snake-jhon/dev-toolbox')
const size = ref(280)
const errorCorrection = ref('M')
const margin = ref(2)
const darkColor = ref('#15171c')
const lightColor = ref('#ffffff')

const dataUrl = ref('')
const svgMarkup = ref('')
const error = ref('')

async function render() {
  if (!text.value) {
    dataUrl.value = ''
    svgMarkup.value = ''
    error.value = ''
    return
  }
  try {
    const opts = {
      errorCorrectionLevel: errorCorrection.value,
      margin: margin.value,
      width: size.value,
      color: { dark: darkColor.value, light: lightColor.value },
    }
    dataUrl.value = await QRCode.toDataURL(text.value, opts)
    svgMarkup.value = await QRCode.toString(text.value, { ...opts, type: 'svg' })
    error.value = ''
  } catch (e) {
    error.value = e.message || 'Could not generate a QR code for this input.'
    dataUrl.value = ''
    svgMarkup.value = ''
  }
}

watch([text, size, errorCorrection, margin, darkColor, lightColor], render, { immediate: true })

const svgDataUrl = computed(() => {
  if (!svgMarkup.value) return ''
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgMarkup.value)))
})

function download(url, filename) {
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadPng() {
  download(dataUrl.value, 'qr-code.png')
}

function downloadSvg() {
  download(svgDataUrl.value, 'qr-code.svg')
}

function loadSample() {
  text.value = 'https://github.com/snake-jhon/dev-toolbox'
}

function clear() {
  text.value = ''
}
</script>

<template>
  <section class="tool">
    <div class="tool-pinned">
      <div class="tool-header">
        <span class="eyebrow">10 · Generate</span>
        <h2>QR Code Generator</h2>
        <p>Turn any text or URL into a downloadable QR code, rendered entirely in your browser.</p>
      </div>

      <div class="row pinned-controls">
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
        <button class="btn btn-sm" type="button" @click="clear">Clear</button>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <span class="field-label">Text or URL</span>
        <textarea v-model="text" class="code-area" style="min-height: 110px" spellcheck="false" placeholder="https://example.com"></textarea>

        <div class="panel" style="margin-top: 16px">
          <span class="field-label">Options</span>

          <div class="row" style="margin-bottom: 10px">
            <label style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-faint)">
              Size (px)
              <input v-model.number="size" type="number" min="100" max="1000" step="20" style="width: 90px" />
            </label>
            <label style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-faint)">
              Margin
              <input v-model.number="margin" type="number" min="0" max="10" style="width: 70px" />
            </label>
          </div>

          <span class="field-label">Error correction</span>
          <div class="chip-toggle" style="margin-bottom: 10px">
            <button type="button" :class="{ active: errorCorrection === 'L' }" @click="errorCorrection = 'L'">L</button>
            <button type="button" :class="{ active: errorCorrection === 'M' }" @click="errorCorrection = 'M'">M</button>
            <button type="button" :class="{ active: errorCorrection === 'Q' }" @click="errorCorrection = 'Q'">Q</button>
            <button type="button" :class="{ active: errorCorrection === 'H' }" @click="errorCorrection = 'H'">H</button>
          </div>

          <div class="row">
            <label style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-faint)">
              Foreground
              <input v-model="darkColor" type="color" style="width: 60px; padding: 2px; height: 32px" />
            </label>
            <label style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-faint)">
              Background
              <input v-model="lightColor" type="color" style="width: 60px; padding: 2px; height: 32px" />
            </label>
          </div>
        </div>
      </div>

      <div>
        <span class="field-label">Preview</span>
        <div class="panel qr-preview">
          <img v-if="dataUrl" :src="dataUrl" :alt="'QR code for ' + text" />
          <p v-else style="color: var(--text-faint); font-size: 13px">Enter text to generate a QR code.</p>
        </div>
        <div class="row" style="margin-top: 10px">
          <button class="btn btn-sm" type="button" :disabled="!dataUrl" @click="downloadPng">Download PNG</button>
          <button class="btn btn-sm" type="button" :disabled="!svgMarkup" @click="downloadSvg">Download SVG</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="status-line err">✕ {{ error }}</div>
  </section>
</template>

<style scoped>
.qr-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.qr-preview img {
  max-width: 100%;
  border-radius: 6px;
}
</style>
