import { Link } from 'react-router-dom'
import {
  FeaturedDevlogCard,
  DevlogCard,
} from '../components/DevlogCard.jsx'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import PageLayout from '../components/PageLayout.jsx'
import SearchInput from '../components/SearchInput.jsx'
import { devlogs } from '../data/devlogs.js'

export default function Home() {
  const featured = devlogs.find((d) => d.featured) || devlogs[0]
  const latest = devlogs.filter((d) => d.slug !== featured.slug).slice(0, 3)

  return (
    <PageLayout>
      <main className="mx-auto max-w-container-max px-margin pb-stack-xl pt-[120px]">
        {/* ── Hero Section ── */}
        <section className="relative mb-stack-xl grid min-h-[70vh] grid-cols-1 items-center gap-gutter md:grid-cols-2">
          <div className="z-10 space-y-stack-md">
            <h1 className="font-serif text-h1 leading-tight text-primary-container drop-shadow-[0_0_15px_rgba(232,196,97,0.4)]">
              ASHN VEYL
            </h1>
            <p className="max-w-md font-sans text-lg leading-relaxed text-on-surface-variant">
              Tracking the evolution of solo indie development. An archaic digital manuscript of
              trials, errors, and dark victories in the void.
            </p>
            <div className="flex gap-4 pt-stack-md">
              <Link
                to="/devlogs"
                className="rounded bg-primary-container px-6 py-3 font-sans text-base font-bold text-on-primary-container transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(46,204,113,0.5)]"
              >
                Enter the Archive
              </Link>
              <Link
                to="/projects"
                className="rounded border border-primary-container/50 px-6 py-3 font-sans text-base text-primary-container transition-all duration-300 hover:border-primary-container hover:shadow-[0_0_15px_rgba(46,204,113,0.5)]"
              >
                View Projects
              </Link>
            </div>
          </div>

          {/* Hero visual + floating glass stat cards */}
          <div className="relative flex h-full items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              {/* Placeholder character render */}
              <div className="absolute inset-0 z-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-surface-container-high via-surface-container to-void shadow-[0_0_30px_rgba(232,196,97,0.15)]">
                <span className="font-serif text-8xl text-primary-container/20">☾</span>
              </div>

              {/* Glass card: development progress */}
              <div className="glass-veil absolute -left-10 top-10 z-20 w-48 rounded p-4 shadow-lg">
                <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary-container">
                  Development Level: 01
                </p>
                <div className="h-1 w-full overflow-hidden rounded bg-surface-container-highest">
                  <div className="h-full w-[45%] bg-secondary shadow-[0_0_5px_rgba(46,204,113,0.8)]" />
                </div>
              </div>

              {/* Glass card: stats */}
              <div className="glass-veil absolute -right-12 bottom-20 z-20 w-56 space-y-2 rounded p-4 shadow-lg">
                <div className="flex justify-between border-b border-primary-container/20 pb-2">
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                    Games Released:
                  </span>
                  <span className="font-mono text-base font-bold text-secondary">1</span>
                </div>
                <div className="pt-1">
                  <span className="block font-sans text-xs text-on-surface-variant">Status:</span>
                  <span className="font-serif text-base italic text-primary-container">
                    Building in Silence
                  </span>
                </div>
              </div>

              {/* Glass card: engine */}
              <div className="glass-veil absolute -bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded p-3 shadow-lg">
                <span className="mr-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                  Main Engine:
                </span>
                <span className="font-sans text-base text-primary-container">godot/GdScript</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search Section ── */}
        <section className="mb-stack-xl flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="Search the archives..."
              roundedFull
            />
          </div>
        </section>

        {/* ── Devlog Feed Section ── */}
        <section className="space-y-stack-xl">
          <div className="mb-stack-md flex items-center gap-4">
            <h2 className="font-serif text-h2 text-primary-container">Archive Entries</h2>
            <OrnamentalDivider className="flex-grow" />
          </div>

          <FeaturedDevlogCard devlog={featured} />

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
            {latest.map((devlog) => (
              <DevlogCard key={devlog.slug} devlog={devlog} />
            ))}
          </div>
        </section>
      </main>
    </PageLayout>
  )
}
