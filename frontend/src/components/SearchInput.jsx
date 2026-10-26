import Icon from './Icon.jsx'

/**
 * Search input. Mockup style: rounded-full on Home, rounded-lg in Codex.
 */
export default function SearchInput({ value, onChange, placeholder, roundedFull = false }) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-container/50">
        <Icon name="search" size={20} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-primary-container/30 bg-surface-container-high/50 px-12 py-4 font-sans text-base text-on-surface transition-all placeholder:text-on-surface-variant/50 focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container ${roundedFull ? 'rounded-full' : 'rounded-lg'
          }`}
      />
    </div>
  )
}
