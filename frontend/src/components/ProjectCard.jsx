import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

/**
 * Project card from the Codex mockup:
 * placeholder image, status badge (emerald pulse when live), engine tag,
 * category label, title, description, footer links.
 */
export default function ProjectCard({ project }) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
      <div>
        {/* Placeholder image area */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-void">
            <Icon
              name="image"
              size={56}
              className="text-primary-container/20 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent" />
          {/* Status badge */}
          {project.status && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-surface-container-lowest/90 px-2.5 py-1 shadow backdrop-blur-sm">
              {project.live && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-secondary shadow-[0_0_8px_#4ae183]" />
              )}
              <span className="font-mono text-[11px] tracking-widest text-secondary">
                {project.status}
              </span>
            </div>
          )}
          {/* Engine tag */}
          {project.engine && (
            <div className="absolute right-3 top-3 rounded bg-surface-container-high/90 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
              {project.engine}
            </div>
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col gap-1 p-4">
          <div className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
            <span>{project.type}</span>
          </div>
          <h3 className="font-serif text-2xl text-primary transition-colors group-hover:text-primary-fixed">
            {project.title}
          </h3>
          <p className="pt-1 font-sans text-base font-light leading-relaxed text-on-surface-variant">
            {project.description}
          </p>
        </div>
      </div>
      {/* Footer links */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <Link
          to={project.links.prototype || '#'}
          className="group/link inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-secondary"
        >
          <span>{project.live ? 'Prototype Build' : 'View Project'}</span>
          <Icon
            name={project.live ? 'open_in_new' : 'arrow_forward'}
            size={16}
            className="transition-transform group-hover/link:translate-x-0.5"
          />
        </Link>
        {project.devlogLabel && (
          <Link
            to={project.links.devlog || '#'}
            className="font-mono text-[11px] tracking-tighter text-on-surface-variant transition-colors hover:text-primary"
          >
            {project.devlogLabel}
          </Link>
        )}
      </div>
    </article>
  )
}
