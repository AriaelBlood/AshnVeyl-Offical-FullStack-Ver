import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/devlogs', label: 'Devlogs' },
  { to: '/projects', label: 'Games' },
  { to: '/projects?filter=art', label: 'Wiki', placeholder: true },
  { to: '/projects?filter=motion', label: 'FAQ', placeholder: true },
]

export default function TopAppBar() {
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

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `font-serif text-lg italic tracking-tight transition-all duration-300 ${isActive && !link.placeholder
                  ? 'scale-95 border-b-2 border-primary-container pb-1 font-bold text-primary-container'
                  : 'px-3 py-1 text-stone-400 hover:bg-white/5 hover:text-primary-container'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-primary-container">
          <button
            type="button"
            aria-label="Search"
            className="rounded-full p-2 transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-lg active:scale-95"
          >
            <Icon name="search" size={22} />
          </button>
          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Menu"
            className="rounded-full p-2 transition-all duration-300 hover:bg-white/5 md:hidden active:scale-95"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
    </nav>
  )
}
