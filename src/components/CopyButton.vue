<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  label: { type: String, default: 'Copy' },
  disabled: { type: Boolean, default: false },
})

const copied = ref(false)

async function copy() {
  if (props.disabled || !props.text) return
  try {
    await navigator.clipboard.writeText(props.text)
  } catch {
    // fallback for environments without clipboard API permission
    const el = document.createElement('textarea')
    el.value = props.text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <button
    class="btn btn-sm btn-copy"
    :class="{ copied }"
    type="button"
    :disabled="disabled || !text"
    @click="copy"
  >
    {{ copied ? 'Copied' : label }}
  </button>
</template>
