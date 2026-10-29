import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/devlogs', label: 'Devlogs' },
  { to: '/projects', label: 'Games' /* Maybe "Projects" well be better */ },
  { to: '/projects?filter=art', label: 'Wiki', placeholder: true }, // FIXME   : need redegine little bit
  { to: '/projects?filter=motion', label: 'FAQ', placeholder: true }, // FIXME : need redegine little bit
]

export default function TopAppBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  const linkClass = ({ isActive }) =>
    `font-serif text-lg italic tracking-tight transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-container ${isActive
      ? 'scale-95 border-b-2 border-primary-container pb-1 font-bold text-primary-container'
      : 'px-3 py-1 text-stone-400 hover:bg-white/5 hover:text-primary-container'
    }`

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-primary-container/20 bg-void/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-margin py-6">
        {/* Wordmark */}
        <NavLink
          to="/"
          className="font-serif text-2xl font-bold uppercase tracking-[0.2em] text-primary-container drop-shadow-[0_0_10px_rgba(232,196,97,0.3)]"
        >
          Ashn Veyl
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-primary-container">
          <button
            type="button"
            aria-label="Search"
            className="rounded-full p-2 transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-lg focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-container active:scale-95"
          >
            <Icon name="search" size={22} />
          </button>
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 transition-all duration-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-container md:hidden active:scale-95"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

          {/* Mobile menu panel */}
      {menuOpen && (
        <div className="glass-veil border-b border-primary-container/20 bg-void/95 px-margin pb-6 pt-2 md:hidden">
          <div className="flex flex-col" onClick={closeMenu}>
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `border-b border-primary-container/10 py-3 font-serif text-lg italic tracking-tight transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-container ${isActive
                    ? 'font-bold text-primary-container'
                    : 'text-stone-400 hover:text-primary-container'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
