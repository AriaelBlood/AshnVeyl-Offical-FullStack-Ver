/**
 * API client — the single place where the frontend talks to the Express backend.
 * Contract: context/FRONTEND_HANDOFF.md
 *
 * All requests go through the Vite dev proxy (/api -> http://localhost:5000),
 * so no hardcoded ports anywhere in the components.
 *
 * Auth is cookie-based ('vault_token'); every authenticated request
 * MUST include credentials: 'include'.
 */

const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function handle(res) {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return data
}

/* ── Auth (The Vault) ─────────────────────────────────────────── */

export async function login(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  return handle(res)
}

export async function checkAuth() {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  return handle(res)
}

export async function logout() {
  const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  return handle(res)
}

/* ── Content ──────────────────────────────────────────────────── */

export async function fetchDevlogs() {
  const res = await fetch('/api/devlogs')
  return handle(res)
}

export async function fetchDevlog(slug) {
  const res = await fetch(`/api/devlogs/${encodeURIComponent(slug)}`, {
    credentials: 'include', // drafts visible when authed
  })
  return handle(res)
}

export async function fetchProjects(category) {
  const url = category
    ? `/api/projects?category=${encodeURIComponent(category)}`
    : '/api/projects'
  const res = await fetch(url)
  return handle(res)
}

/* ── Studio submission ────────────────────────────────────────── */

export async function fetchAdminDevlogs() {
  const res = await fetch('/api/devlogs/admin/all', { credentials: 'include' })
  return handle(res)
}

export async function createDevlog(payload) {
  const res = await fetch('/api/devlogs', {
    method: 'POST',
    headers: JSON_HEADERS,
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handle(res)
}

export async function updateDevlog(id, payload) {
  const res = await fetch(`/api/devlogs/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handle(res)
}

export async function deleteDevlog(id) {
  const res = await fetch(`/api/devlogs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return handle(res)
}
