import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

/**
 * Featured devlog card (Home mockup): wide glass card, image half + content half.
 */
export function FeaturedDevlogCard({ devlog }) {
  return (
    <Link
      to={`/devlogs/${devlog.slug}`}
      className="group glass-veil flex flex-col overflow-hidden rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(232,196,97,0.1)] md:flex-row"
    >
      {/* Image half — placeholder gradient */}
      <div className="relative h-64 w-full bg-gradient-to-br from-surface-container-high via-surface-container to-void md:h-auto md:w-1/2">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="image" size={64} className="text-primary-container/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent md:bg-gradient-to-l md:from-surface-container-lowest/90 md:to-transparent" />
        <div className="absolute left-4 top-4 rounded bg-primary-container px-2 py-1 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-primary-container shadow-md">
          FEATURED
        </div>
      </div>
      {/* Content half */}
      <div className="flex w-full flex-col justify-center gap-4 p-8 md:w-1/2">
        <div className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
          <span>{devlog.date}</span>
          <span className="inline-block h-1 w-1 rotate-45 bg-primary-container/50" />
          <span>{devlog.readTime}</span>
        </div>
        <h3 className="font-serif text-2xl text-on-surface transition-colors duration-300 group-hover:text-primary-container">
          {devlog.title}
        </h3>
        <p className="font-sans text-base leading-relaxed text-on-surface-variant/80">
          {devlog.summary}
        </p>
        <div className="pt-4">
          <span className="flex items-center gap-2 border-b border-primary-container/30 pb-1 font-sans text-base text-primary-container transition-all duration-300 group-hover:border-primary-container group-hover:text-emerald-void">
            Read Article <Icon name="arrow_forward" size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}

/**
 * Devlog grid card (Home mockup, latest articles).
 */
export function DevlogCard({ devlog }) {
  return (
    <Link
      to={`/devlogs/${devlog.slug}`}
      className="group glass-veil flex flex-col overflow-hidden rounded-lg transition-all hover:shadow-[0_0_15px_rgba(232,196,97,0.1)]"
    >
      {/* Placeholder image strip */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-primary-container/20 bg-surface-container-high">
        <Icon
          name="image"
          size={64}
          className="text-primary-container/30 transition-colors duration-500 group-hover:text-primary-container/60"
        />
      </div>
      <div className="flex flex-grow flex-col gap-3 p-6">
        <div className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
          DEVLOG #{devlog.number}
        </div>
        <h4 className="font-serif text-lg text-on-surface transition-colors group-hover:text-primary-container">
          {devlog.title.replace(`Devlog #${devlog.number}: `, '')}
        </h4>
        <p className="flex-grow font-sans text-sm leading-relaxed text-on-surface-variant/70">
          {devlog.summary}
        </p>
        <span className="font-sans text-sm uppercase tracking-widest text-primary-container transition-colors group-hover:text-emerald-void">
          Read →
        </span>
      </div>
    </Link>
  )
}
