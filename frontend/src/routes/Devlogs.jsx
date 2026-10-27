import { useMemo, useState } from 'react'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import PageLayout from '../components/PageLayout.jsx'
import SearchInput from '../components/SearchInput.jsx'
import {
  FeaturedDevlogCard,
  DevlogCard,
} from '../components/DevlogCard.jsx'
import { devlogs } from '../data/devlogs.js'

export default function Devlogs() {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return devlogs
    return devlogs.filter((d) =>
      [d.title, d.summary, d.category, d.number].join(' ').toLowerCase().includes(q),
    )
  }, [query])

  const featured = visible.find((d) => d.featured) || visible[0]
  const rest = visible.filter((d) => d !== featured)

  return (
    <PageLayout>
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-primary-container/5 blur-[140px]" />

        <main className="mx-auto flex max-w-container-max flex-col gap-stack-xl px-margin pb-stack-xl pt-stack-md">
          {/* Header */}
          <section className="mx-auto flex max-w-3xl flex-col items-center space-y-stack-md pt-stack-xs text-center">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
                The Manuscripts // Development Chronicle
              </span>
              <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
            </div>
            <h1 className="font-serif text-h1 tracking-tight text-primary">Archive Entries</h1>
            <p className="max-w-2xl font-sans text-lg font-light text-on-surface-variant">
              Every trial recorded. Every error preserved. The chronicle of the hunt, entry by
              entry.
            </p>
            <div className="relative flex w-48 items-center justify-center pt-stack-xs">
              <OrnamentalDivider />
            </div>
          </section>

          {/* Search */}
          <section className="mx-auto w-full max-w-2xl">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Filter manuscripts by keyword, topic..."
            />
          </section>

          {visible.length > 0 ? (
            <>
              {featured && <FeaturedDevlogCard devlog={featured} />}
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                {rest.map((devlog) => (
                  <DevlogCard key={devlog.slug} devlog={devlog} />
                ))}
              </div>
            </>
          ) : (
            <p className="py-stack-xl text-center font-sans text-on-surface-variant/60">
              No manuscripts match your incantation.
            </p>
          )}
        </main>
      </div>
    </PageLayout>
  )
}
