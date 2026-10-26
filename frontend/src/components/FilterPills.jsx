/**
 * Filter pills from the Codex mockup.
 * tabs: [{ id, label, count, accent? }]
 */
export default function FilterPills({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-stack-xs">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`group flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 ${isActive
                ? 'bg-surface-container-high text-primary shadow-[0_0_12px_rgba(232,196,97,0.2)]'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rotate-45 transition-colors ${isActive ? 'bg-primary-container' : 'bg-transparent group-hover:bg-primary-container'
                }`}
            />
            <span>{tab.label}</span>
            {tab.count != null && (
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${isActive ? 'bg-surface-container text-on-surface' : 'bg-surface-container text-on-surface'
                  }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
