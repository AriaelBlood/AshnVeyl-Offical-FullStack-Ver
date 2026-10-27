import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import PageLayout from '../components/PageLayout.jsx'
import { devlogs } from '../data/devlogs.js'

/**
 * Block renderer — structured JS data blocks from src/data/devlogs.js.
 * (CodeBlock lands in Phase 3; for now code blocks show a styled placeholder.)
 */
function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="mb-stack-md mt-stack-xl font-serif text-h2 text-primary-container">
          {block.text}
        </h2>
      )
    case 'paragraph':
      return (
        <p
          className={`font-sans text-on-surface-variant ${
            block.lead
              ? 'mb-stack-xl text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:text-primary-container'
              : 'leading-relaxed'
          }`}
        >
          {block.text}
        </p>
      )
    case 'divider':
      return <OrnamentalDivider label={block.label} className="my-stack-xl py-4" />
    case 'image':
      return (
        <figure className="my-stack-xl">
          <div className="glass-veil flex h-64 items-center justify-center rounded-lg glow-gold">
            <Icon name="image" size={48} className="text-primary-container/20" />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center font-sans text-xs uppercase tracking-widest text-on-surface-variant/60">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'code':
      return (
        <div className="my-stack-xl overflow-hidden rounded-xl border border-primary-container/20 shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between border-b border-primary-container/15 bg-void/90 px-4 py-3 font-mono text-xs">
            <span className="flex items-center gap-2 text-primary-container">
              <Icon name="code" size={14} className="text-emerald-void" />
              {block.file}
            </span>
            <span className="text-on-surface-variant/50">{block.lang}</span>
          </div>
          <pre className="overflow-x-auto bg-void/60 p-4 font-mono text-sm leading-relaxed text-on-surface">
            {block.code}
          </pre>
        </div>
      )
    case 'callout':
      return (
        <aside className="glass-veil my-stack-xl rounded-lg p-6">
          <p className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary-container">
            <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
            {block.title}
          </p>
          <p className="font-sans text-base italic leading-relaxed text-on-surface-variant">
            {block.text}
          </p>
        </aside>
      )
    default:
      return null
  }
}

export default function DevlogArticle() {
  const { slug } = useParams()
  const devlog = devlogs.find((d) => d.slug === slug)

  if (!devlog) {
    return (
      <PageLayout>
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-stack-md text-center">
          <p className="text-label-caps uppercase text-primary-fixed-dim">Lost in the void</p>
          <h1 className="font-serif text-h2 text-primary-container">Manuscript not found</h1>
          <Link
            to="/devlogs"
            className="border-b border-primary-container/30 pb-1 font-sans text-base text-primary-container hover:border-primary-container"
          >
            Return to the Archive
          </Link>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <main className="mx-auto max-w-container-max px-margin pb-stack-xl pt-stack-xl">
        {/* Article header */}
        <section className="mb-stack-xl flex flex-col items-center text-center">
          <div className="mb-stack-md flex flex-wrap items-center justify-center gap-4 font-sans text-xs font-semibold uppercase tracking-widest text-primary-container/60">
            <span>{devlog.date}</span>
            <span className="text-primary-container">◆</span>
            <span>{devlog.category}</span>
            <span className="text-primary-container">◆</span>
            <span>{devlog.readTime}</span>
          </div>
          <h1 className="mb-stack-md max-w-4xl font-serif text-h1 leading-tight text-primary-container">
            {devlog.title}
          </h1>
          {/* Hero image placeholder */}
          <div className="glass-veil relative mt-stack-md flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg glow-gold md:h-[500px]">
            <Icon name="image" size={72} className="text-primary-container/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-60" />
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto mb-stack-xl max-w-[800px]">
          {devlog.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        {/* Back navigation */}
        <div className="mx-auto max-w-[800px]">
          <OrnamentalDivider className="mb-stack-md" />
          <Link
            to="/devlogs"
            className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-container transition-colors hover:text-emerald-void"
          >
            <Icon name="arrow_forward" size={16} className="rotate-180" /> All Manuscripts
          </Link>
        </div>
      </main>
    </PageLayout>
  )
}
