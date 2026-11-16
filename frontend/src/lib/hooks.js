import { useEffect, useState } from 'react'
import { fetchDevlog, fetchDevlogs, fetchProjects } from './api.js'
import { devlogs as mockDevlogs } from '../data/devlogs.js'
import { projects as mockProjects } from '../data/projects.js'

/**
 * Content hooks — fetch from the backend, fall back to mock data when
 * the API is unreachable (so the site still works in offline/dev previews).
 *
 * Every hook returns { data, loading, error, isFallback }.
 */

function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null, isFallback: false })

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are passed in by each hook
  useEffect(() => {
    let cancelled = false
    setState({ data: null, loading: true, error: null, isFallback: false })
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null, isFallback: false }))
      .catch((err) => {
        if (cancelled) return
        // Fallback to mock data keeps the site browsable without a backend
        setState({ data: null, loading: false, error: err, isFallback: true })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export function useDevlogs() {
  const api = useAsync(fetchDevlogs, [])
  return api.error ? { ...api, data: mockDevlogs } : api
}

export function useDevlog(slug) {
  const api = useAsync(() => fetchDevlog(slug), [slug])
  if (!api.error) return api
  const mock = mockDevlogs.find((d) => d.slug === slug)
  return mock ? { ...api, data: mock } : api
}

export function useProjects(category) {
  const api = useAsync(() => fetchProjects(category), [category])
  return api.error ? { ...api, data: mockProjects } : api
}
