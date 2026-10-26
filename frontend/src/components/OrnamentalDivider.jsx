/**
 * Ornamental divider: thin gold gradient line with a centered diamond.
 * `label` renders small caps text instead of the diamond (mockup "MECHANICAL SCHEMATICS" style).
 */
export default function OrnamentalDivider({ label, className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-container/30 to-transparent" />
      {label ? (
        <span className="absolute bg-void px-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary-container">
          {label}
        </span>
      ) : (
        <div className="absolute h-2 w-2 rotate-45 border border-primary-container/60 bg-void shadow-[0_0_8px_rgba(232,196,97,0.3)]" />
      )}
    </div>
  )
}
