import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/json-formatter',
  },
  {
    path: '/json-formatter',
    name: 'json-formatter',
    component: () => import('../components/JsonFormatter.vue'),
    meta: { label: 'JSON Formatter', icon: 'json' },
  },
  {
    path: '/base64-url',
    name: 'base64-url',
    component: () => import('../components/Base64UrlEncoder.vue'),
    meta: { label: 'Base64 & URL', icon: 'code' },
  },
  {
    path: '/jwt-decoder',
    name: 'jwt-decoder',
    component: () => import('../components/JwtDecoder.vue'),
    meta: { label: 'JWT Decoder', icon: 'key' },
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    component: () => import('../components/TimestampConverter.vue'),
    meta: { label: 'Timestamp', icon: 'clock' },
  },
  {
    path: '/uuid-generator',
    name: 'uuid-generator',
    component: () => import('../components/UuidGenerator.vue'),
    meta: { label: 'UUID Generator', icon: 'hash' },
  },
  {
    path: '/word-counter',
    name: 'word-counter',
    component: () => import('../components/WordCharCounter.vue'),
    meta: { label: 'Word & Char Counter', icon: 'text' },
  },
  {
    path: '/regex-tester',
    name: 'regex-tester',
    component: () => import('../components/RegexTester.vue'),
    meta: { label: 'Regex Tester', icon: 'regex' },
  },
  {
    path: '/markdown-previewer',
    name: 'markdown-previewer',
    component: () => import('../components/MarkdownPreviewer.vue'),
    meta: { label: 'Markdown Previewer', icon: 'markdown' },
  },
  {
    path: '/diff-checker',
    name: 'diff-checker',
    component: () => import('../components/DiffChecker.vue'),
    meta: { label: 'Diff Checker', icon: 'diff' },
  },
  {
    path: '/qr-code-generator',
    name: 'qr-code-generator',
    component: () => import('../components/QrCodeGenerator.vue'),
    meta: { label: 'QR Code Generator', icon: 'qr' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
