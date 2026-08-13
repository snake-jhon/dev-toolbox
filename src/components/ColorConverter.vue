<script setup>
import { ref, computed } from 'vue'
import CopyButton from './CopyButton.vue'

const input = ref('#e5484d')
const compareColor = ref('#ffffff')

// --- validation + parsing via the browser's own CSS color engine ---
// This lets us accept hex (3/4/6/8 digit), rgb()/rgba(), hsl()/hsla(),
// and CSS named colors (e.g. "rebeccapurple") without writing a parser.
function isValidCssColor(str) {
  if (!str || !str.trim()) return false
  const opt = new Option()
  opt.style.color = ''
  opt.style.color = str
  return opt.style.color !== ''
}

let canvas = null
function getCanvasCtx() {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
  }
  return canvas.getContext('2d', { willReadFrequently: true })
}

function parseToRgba(str) {
  if (!isValidCssColor(str)) return null
  const ctx = getCanvasCtx()
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#000000'
  ctx.fillStyle = str
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return { r, g, b, a: +(a / 255).toFixed(3) }
}

const parsed = computed(() => parseToRgba(input.value))
const isValid = computed(() => parsed.value !== null)

// --- format conversions ---
function toHex({ r, g, b, a }) {
  const hex = (n) => n.toString(16).padStart(2, '0')
  const base = `#${hex(r)}${hex(g)}${hex(b)}`
  return a < 1 ? base + hex(Math.round(a * 255)) : base
}

function toRgbString({ r, g, b, a }) {
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function toHslString({ r, g, b, a }) {
  const { h, s, l } = rgbToHsl(r, g, b)
  return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`
}

const formats = computed(() => {
  if (!parsed.value) return null
  return {
    hex: toHex(parsed.value),
    rgb: toRgbString(parsed.value),
    hsl: toHslString(parsed.value),
  }
})

const swatchColor = computed(() => (isValid.value ? input.value : 'transparent'))

const pickerValue = computed({
  get: () => (formats.value ? formats.value.hex.slice(0, 7) : '#000000'),
  set: (val) => {
    input.value = val
  },
})

// --- contrast ---
function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(rgba1, rgba2) {
  const l1 = relativeLuminance(rgba1)
  const l2 = relativeLuminance(rgba2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const blackRgba = { r: 0, g: 0, b: 0 }
const whiteRgba = { r: 255, g: 255, b: 255 }

const contrastVsBlack = computed(() => (parsed.value ? contrastRatio(parsed.value, blackRgba) : null))
const contrastVsWhite = computed(() => (parsed.value ? contrastRatio(parsed.value, whiteRgba) : null))

const comparedParsed = computed(() => parseToRgba(compareColor.value))
const contrastVsCompare = computed(() =>
  parsed.value && comparedParsed.value ? contrastRatio(parsed.value, comparedParsed.value) : null
)

const comparePickerValue = computed({
  get: () => (comparedParsed.value ? toHex(comparedParsed.value).slice(0, 7) : '#000000'),
  set: (val) => {
    compareColor.value = val
  },
})

function ratioLabel(ratio) {
  if (ratio === null) return { text: '—', level: '' }
  const r = ratio.toFixed(2)
  if (ratio >= 7) return { text: `${r}:1 · AAA`, level: 'ok' }
  if (ratio >= 4.5) return { text: `${r}:1 · AA`, level: 'ok' }
  if (ratio >= 3) return { text: `${r}:1 · AA (large text only)`, level: 'warn' }
  return { text: `${r}:1 · Fails`, level: 'err' }
}

function loadSample() {
  input.value = '#e5484d'
  compareColor.value = '#ffffff'
}
</script>

<template>
  <section class="tool">
    <div class="tool-pinned">
      <div class="tool-header">
        <span class="eyebrow">11 · Convert</span>
        <h2>Color Converter</h2>
        <p>Convert between HEX, RGB, and HSL, and check contrast ratios for accessibility.</p>
      </div>

      <div class="row pinned-controls">
        <input v-model="pickerValue" type="color" style="width: 46px; padding: 2px; height: 36px" />
        <input v-model="input" type="text" placeholder="#e5484d, rgb(229 72 77), hsl(357 76% 59%), rebeccapurple" style="flex: 1; min-width: 220px" spellcheck="false" />
        <button class="btn btn-sm" type="button" @click="loadSample">Load sample</button>
      </div>
    </div>

    <div v-if="!isValid" class="status-line err">✕ Not a recognizable CSS color. Try a hex code, rgb()/hsl() function, or a named color like "coral".</div>

    <template v-else>
      <div class="grid-2">
        <div class="panel" style="display: flex; align-items: center; justify-content: center; min-height: 180px">
          <div class="swatch" :style="{ background: swatchColor }"></div>
        </div>

        <div class="panel">
          <span class="field-label">Formats</span>
          <table class="kv-table">
            <tbody>
              <tr>
                <td>HEX</td>
                <td class="row" style="justify-content: space-between">
                  <code>{{ formats.hex }}</code>
                  <CopyButton :text="formats.hex" label="Copy" />
                </td>
              </tr>
              <tr>
                <td>RGB</td>
                <td class="row" style="justify-content: space-between">
                  <code>{{ formats.rgb }}</code>
                  <CopyButton :text="formats.rgb" label="Copy" />
                </td>
              </tr>
              <tr>
                <td>HSL</td>
                <td class="row" style="justify-content: space-between">
                  <code>{{ formats.hsl }}</code>
                  <CopyButton :text="formats.hsl" label="Copy" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <span class="field-label">Contrast (WCAG)</span>
        <table class="kv-table">
          <tbody>
            <tr>
              <td>vs. black text</td>
              <td>
                <span class="status-line" :class="ratioLabel(contrastVsBlack).level" style="display: inline-flex; padding: 3px 10px">
                  {{ ratioLabel(contrastVsBlack).text }}
                </span>
              </td>
            </tr>
            <tr>
              <td>vs. white text</td>
              <td>
                <span class="status-line" :class="ratioLabel(contrastVsWhite).level" style="display: inline-flex; padding: 3px 10px">
                  {{ ratioLabel(contrastVsWhite).text }}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                vs.
                <input v-model="comparePickerValue" type="color" style="width: 32px; height: 22px; padding: 1px; vertical-align: middle" />
                <input v-model="compareColor" type="text" style="width: 110px; padding: 4px 8px; font-size: 12px; vertical-align: middle" spellcheck="false" />
              </td>
              <td>
                <span
                  v-if="comparedParsed"
                  class="status-line"
                  :class="ratioLabel(contrastVsCompare).level"
                  style="display: inline-flex; padding: 3px 10px"
                >
                  {{ ratioLabel(contrastVsCompare).text }}
                </span>
                <span v-else class="status-line err" style="display: inline-flex; padding: 3px 10px">✕ Invalid color</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p style="font-size: 12px; margin-top: 10px">
          AA needs 4.5:1 (3:1 for large text); AAA needs 7:1. Ratios are calculated per WCAG 2 relative luminance.
        </p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.swatch {
  width: 100%;
  height: 140px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

code {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-primary);
}
</style>
