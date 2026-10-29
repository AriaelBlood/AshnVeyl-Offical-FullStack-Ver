import { useMemo, useState } from 'react'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import SearchInput from '../components/SearchInput.jsx'
import PageLayout from '../components/PageLayout.jsx'
import FilterPills from '../components/FilterPills.jsx'
import { categories, projects } from '../data/projects.js'

export default function Projects() {
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')

  const tabs = categories.map((cat) => ({
    ...cat,
    count: cat.id === 'all' ? projects.length : projects.filter((p) => p.category === cat.id).length,
  }))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      const inCategory = active === 'all' || p.category === active
      const inQuery =
        !q ||
        [p.title, p.description, p.type, p.engine, p.status]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      return inCategory && inQuery
    })
  }, [active, query])

  return (
    <PageLayout>
      <div className="relative w-full overflow-hidden">
        {/* Ambient gold glow backdrop */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-primary-container/5 blur-[140px]" />

        <main className="mx-auto flex max-w-container-max flex-col gap-stack-xl px-margin pb-stack-xl pt-stack-md">
          {/* Header & Codex Summary */}
          <section className="mx-auto flex max-w-3xl flex-col items-center space-y-stack-md pt-stack-xs text-center">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
                The Codex of Creations // Solo Works
              </span>
              <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
            </div>
            <h1 className="font-serif text-h1 leading-tight tracking-tight text-primary">
              Projects, Art &amp; Motion
            </h1>
            <p className="max-w-2xl font-sans text-lg font-light leading-relaxed text-on-surface-variant">
              A curated repository spanning indie game prototypes, standalone character studies, and
              technical motion breakdowns forged in obsidian and light.
            </p>
            <div className="relative flex w-48 items-center justify-center pt-stack-xs">
              <OrnamentalDivider />
            </div>
          </section>

          {/* Filter & Search bar */}
          <section className="flex flex-col items-center justify-between gap-stack-md rounded-xl bg-surface-container-lowest/80 p-4 shadow-lg backdrop-blur-md lg:flex-row">
            <FilterPills tabs={tabs} active={active} onChange={setActive} />
            <div className="w-full max-w-sm lg:w-72 lg:max-w-none">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Filter codex by keyword, engine..."
              />
            </div>
          </section>

          {/* Archive Grid */}
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="py-stack-xl text-center font-sans text-on-surface-variant/60">
              Nothing found in this wing of the archive.
            </p>
          )}
        </main>
      </div>
    </PageLayout>
  )
}
