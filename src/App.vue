<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/json-formatter', label: 'JSON Formatter', hint: 'format · validate', icon: 'json' },
  { path: '/base64-url', label: 'Base64 & URL', hint: 'encode · decode', icon: 'code' },
  { path: '/jwt-decoder', label: 'JWT Decoder', hint: 'header · payload', icon: 'key' },
  { path: '/timestamp', label: 'Timestamp', hint: 'unix · human', icon: 'clock' },
  { path: '/uuid-generator', label: 'UUID Generator', hint: 'v4', icon: 'hash' },
]

const icons = {
  json: 'M7 3a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2m10-14a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2',
  code: 'M9 7 4 12l5 5m6-10 5 5-5 5',
  key: 'M14.5 7.5a3.5 3.5 0 1 1-4.95 4.95L7 15v2H5v2H2v-3l6.55-6.55A3.5 3.5 0 0 1 14.5 7.5Zm0 0 1.5-1.5',
  clock: 'M12 7v5l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
}
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#1b1e25" />
          <path
            d="M21.5 8.5a5 5 0 0 0-6.8 5.8l-7.4 7.4a2 2 0 0 0 2.8 2.8l7.4-7.4a5 5 0 0 0 5.8-6.8l-3.1 3.1-2.3-2.3 3.1-3.1z"
            fill="#e8a33d"
          />
        </svg>
        <div class="brand-text">
          <strong>Dev Toolbox</strong>
          <span>client-side utilities</span>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path :d="icons[item.icon]" />
          </svg>
          <span class="nav-label">
            <span class="nav-title">{{ item.label }}</span>
            <span class="nav-hint">{{ item.hint }}</span>
          </span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <a href="https://github.com/snake-jhon/dev-toolbox" target="_blank" rel="noopener">Source on GitHub</a>
      </div>
    </aside>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--bg-panel);
  border-right: 1px solid var(--border-soft);
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
}

.brand-mark {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text-primary);
}

.brand-text span {
  font-size: 11px;
  color: var(--text-faint);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text-muted);
  border-left: 2px solid transparent;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-left-color: var(--accent);
}

.nav-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.nav-label {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.nav-title {
  font-size: 13px;
  font-family: var(--mono);
}

.nav-hint {
  font-size: 10.5px;
  color: var(--text-faint);
}

.nav-item.active .nav-hint {
  color: var(--accent-dim);
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 6px;
}

.sidebar-footer a {
  font-size: 11.5px;
  color: var(--text-faint);
  text-decoration: none;
}

.sidebar-footer a:hover {
  color: var(--accent);
}

.main {
  padding: 36px 40px;
  overflow-x: hidden;
}

@media (max-width: 860px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-soft);
    flex-direction: column;
  }

  .nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 4px;
  }

  .nav-item {
    border-left: none;
    border-bottom: 2px solid transparent;
    flex-shrink: 0;
  }

  .nav-item.active {
    border-bottom-color: var(--accent);
  }

  .nav-hint {
    display: none;
  }

  .sidebar-footer {
    display: none;
  }

  .main {
    padding: 24px 18px;
  }
}
</style>
