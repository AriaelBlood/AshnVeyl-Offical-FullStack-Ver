import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { checkAuth, login as apiLogin, logout as apiLogout } from './api.js'

/**
 * AuthProvider — checks /api/auth/me on mount, exposes login/logout.
 * Wrap the app once; consume via useAuth().
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    checkAuth()
      .then((data) => {
        if (!cancelled) setUser(data?.authenticated ? data.user : null)
      })
      .catch(() => {
        // Backend down or cookie invalid — treat as guest
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: Boolean(user),
      async login(username, password) {
        const res = await apiLogin(username, password)
        setUser(res?.user || { username })
      },
      async logout() {
        await apiLogout().catch(() => { })
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
