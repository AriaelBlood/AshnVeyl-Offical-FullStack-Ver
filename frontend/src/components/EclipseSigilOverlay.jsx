import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import Icon from './Icon.jsx'

/**
 * The Eclipse Sigil Overlay — Seals II & III of the secret gate.
 *
 * Full-screen glassmorphism overlay. First it shows the incantation prompt
 * ("Speak the name of the hunter" — typed keys are captured by SealsProvider).
 * When the incantation matches, it unlocks into the Vault login modal.
 */
export default function EclipseSigilOverlay({ stage, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  // The SealsProvider captures keystrokes globally while this overlay is open
  // and flips `stage` to 'login' when the incantation matches.

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await authLogin(username, password)
      onClose()
      navigate('/studio')
    } catch (err) {
      setError(err.message || 'The Vault rejected the offering.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* Eclipse sigil backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[520px] w-[520px] rounded-full border border-primary-container/20 shadow-[0_0_120px_rgba(232,196,97,0.15)]">
          <div className="absolute inset-8 rounded-full border border-primary-container/10" />
          <div className="absolute inset-24 rounded-full border border-emerald-void/10" />
        </div>
      </div>

      {stage === 'sigil' ? (
        <p className="relative z-10 animate-pulse font-serif text-2xl italic tracking-wide text-primary-container">
          Speak the name of the hunter…
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="glass-veil relative z-10 w-full max-w-sm space-y-stack-md rounded-lg p-8 shadow-[0_0_60px_rgba(232,196,97,0.1)]"
        >
          <div className="mb-stack-md text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
              The Vault
            </p>
            <h2 className="mt-2 font-serif text-h3 text-primary-container">Identify Yourself</h2>
          </div>

          {error && (
            <p className="border border-error/30 bg-error/10 rounded p-3 text-center font-sans text-sm text-error">
              {error}
            </p>
          )}

          <label className="block">
            <span className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-sans text-base text-on-surface focus:border-primary-container focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-sans text-base text-on-surface focus:border-primary-container focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-stack-md w-full rounded bg-primary-container px-6 py-3 font-sans text-base font-bold text-on-primary-container transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(46,204,113,0.5)] disabled:opacity-50"
          >
            {busy ? 'Unlocking…' : 'Unlock the Vault'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mx-auto flex items-center gap-1 pt-2 font-sans text-xs uppercase tracking-widest text-on-surface-variant/50 transition-colors hover:text-primary-container"
          >
            <Icon name="close" size={12} /> Seal the door again
          </button>
        </form>
      )}
    </div>
  )
}
