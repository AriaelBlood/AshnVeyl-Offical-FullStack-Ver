import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import EclipseSigilOverlay from '../components/EclipseSigilOverlay.jsx'

/**
 * The Three Seals — secret gate to the Studio (lore: context/FRONTEND_HANDOFF.md §2).
 *
 * Sequence: Seal I (footer diamond ×3) → arms for 15s
 *           Seal II (hero avatar click while armed) → Eclipse Sigil overlay
 *           Seal III (type "ashnveyl") → onSealUnlocked() (opens login modal)
 *
 * Wrap once near the app root; consume via useSeals().
 */
const SealsContext = createContext(null)

export const INCANTATION = 'ashnveyl'
const ARM_DURATION_MS = 15000

export function SealsProvider({ children, onSealUnlocked }) {
  // 'idle' → Seal I clicks counted → 'armed' → Seal II pressed → 'sigil' (overlay open)
  const [sealState, setSealState] = useState('idle')
  const [diamondTurns, setDiamondTurns] = useState(0)
  const [sigilOpen, setSigilOpen] = useState(false)
  const [sigilStage, setSigilStage] = useState('sigil') // 'sigil' | 'login'
  const armTimer = useRef(null)
  const turnsRef = useRef(0)

  const clearArmTimer = () => {
    if (armTimer.current) clearTimeout(armTimer.current)
    armTimer.current = null
  }

  // Seal I: each footer-diamond click rotates 45°; 3rd click arms for 15s
  const clickDiamond = useCallback(() => {
    const next = turnsRef.current + 1
    if (next >= 3) {
      turnsRef.current = 0
      setDiamondTurns(0)
      setSealState('armed')
      clearArmTimer()
      armTimer.current = setTimeout(() => {
        setSealState('idle')
        turnsRef.current = 0
        setDiamondTurns(0)
      }, ARM_DURATION_MS)
    } else {
      turnsRef.current = next
      setDiamondTurns(next)
    }
  }, [])

  // Seal II: avatar click while armed
  const clickAvatar = useCallback(() => {
    if (sealState !== 'armed') return false
    clearArmTimer()
    setSealState('sigil')
    setSigilStage('sigil')
    setSigilOpen(true)
    return true
  }, [sealState])

  // Seal III: incantation keypress listener while the sigil is open —
  // on match, the sigil unlocks into the login modal (stage: 'login')
  useEffect(() => {
    if (!sigilOpen) return undefined
    let buffer = ''
    const onKey = (e) => {
      if (e.key === 'Escape') {
        turnsRef.current = 0
        setDiamondTurns(0)
        setSigilOpen(false)
        setSigilStage('sigil')
        setSealState('idle')
        return
      }
      if (sigilStage !== 'sigil') return
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer = (buffer + e.key.toLowerCase()).slice(-INCANTATION.length)
        if (buffer === INCANTATION) {
          turnsRef.current = 0
          setDiamondTurns(0)
          setSigilStage('login')
          setSealState('idle')
          onSealUnlocked?.()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sigilOpen, sigilStage, onSealUnlocked])

  useEffect(() => clearArmTimer, [])

  const closeSigil = useCallback(() => {
    turnsRef.current = 0
    setDiamondTurns(0)
    setSigilOpen(false)
    setSigilStage('sigil')
    setSealState('idle')
  }, [])

  return (
    <SealsContext.Provider value={{ sealState, diamondTurns, clickDiamond, clickAvatar }}>
      {children}
      {sigilOpen && <EclipseSigilOverlay stage={sigilStage} onClose={closeSigil} />}
    </SealsContext.Provider>
  )
}

export function useSeals() {
  const ctx = useContext(SealsContext)
  if (!ctx) throw new Error('useSeals must be used inside <SealsProvider>')
  return ctx
}
