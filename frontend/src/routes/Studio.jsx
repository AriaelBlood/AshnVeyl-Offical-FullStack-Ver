import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import PageLayout from '../components/PageLayout.jsx'

/**
 * The Studio — post add/edit/publish UI. STATIC DESIGN ONLY (Phase 2):
 * no persistence, state lives in this component and dies on reload.
 *
 * Block-based body editor: paragraph / heading / code / image / divider / callout.
 * Maps to the same block schema as src/data/devlogs.js, so the backend
 * later accepts exactly what this UI produces.
 */

const blockTemplates = {
  paragraph: { type: 'paragraph', text: '' },
  heading: { type: 'heading', text: '' },
  divider: { type: 'divider' },
  image: { type: 'image', src: '', alt: '', caption: '' },
  code: { type: 'code', file: 'script.gd', lang: 'gdscript', code: '' },
  callout: { type: 'callout', title: '', text: '' },
}

const blockTypeMeta = {
  paragraph: { icon: 'text_fields', label: 'Paragraph' },
  heading: { icon: 'edit', label: 'Heading' },
  divider: { icon: 'drag_handle', label: 'Divider' },
  image: { icon: 'image', label: 'Image' },
  code: { icon: 'code', label: 'Code' },
  callout: { icon: 'publish', label: 'Callout' },
}

export default function Studio() {
  const [meta, setMeta] = useState({
    title: '',
    slug: '',
    category: '',
    published: false,
  })
  const [blocks, setBlocks] = useState([{ ...blockTemplates.paragraph }])

  const updateMeta = (key) => (e) => setMeta({ ...meta, [key]: e.target.value })

  const updateBlock = (i, key) => (e) => {
    const next = [...blocks]
    next[i] = { ...next[i], [key]: e.target.value }
    setBlocks(next)
  }

  const addBlock = (type) => setBlocks([...blocks, { ...blockTemplates[type] }])

  const removeBlock = (i) => setBlocks(blocks.filter((_, idx) => idx !== i))

  const moveBlock = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    setBlocks(next)
  }

  return (
    <PageLayout>
      <main className="mx-auto max-w-4xl px-margin pb-stack-xl pt-stack-md">
        {/* Header */}
        <section className="mb-stack-xl text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
              The Studio // Restricted Wings
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
          </div>
          <h1 className="mt-stack-md font-serif text-h1 text-primary">Compose a Manuscript</h1>
        </section>

        {/* Post meta */}
        <section className="glass-veil mb-stack-xl space-y-stack-md rounded-lg p-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary-container">
            Manuscript Details
          </p>
          {/* Title */}
          <div>
            <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
              Title
            </label>
            <input
              type="text"
              value={meta.title}
              onChange={updateMeta('title')}
              placeholder="Devlog #15: ..."
              className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-serif text-xl text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
            />
          </div>
          {/* Slug + Category */}
          <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
            <div>
              <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                Slug
              </label>
              <input
                type="text"
                value={meta.slug}
                onChange={updateMeta('slug')}
                placeholder="devlog-15-..."
                className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                Category
              </label>
              <input
                type="text"
                value={meta.category}
                onChange={updateMeta('category')}
                placeholder="COMBAT SYSTEMS"
                className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-sans text-base uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
              />
            </div>
          </div>
          {/* Publish toggle */}
          <div className="flex items-center justify-between border-t border-primary-container/10 pt-stack-md">
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">
              Status:{' '}
              <span className={meta.published ? 'text-emerald-void' : 'text-primary-container'}>
                {meta.published ? 'Published' : 'Draft'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setMeta({ ...meta, published: !meta.published })}
              className={`flex items-center gap-2 rounded px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-all ${
                meta.published
                  ? 'bg-secondary-container text-on-secondary'
                  : 'bg-primary-container text-on-primary-container hover:shadow-[0_0_15px_rgba(46,204,113,0.5)]'
              }`}
            >
              <Icon name={meta.published ? 'check' : 'publish'} size={16} />
              {meta.published ? 'Published — click to unpublish' : 'Publish Manuscript'}
            </button>
          </div>
        </section>

        {/* Block editor */}
        <section className="mb-stack-xl">
          <OrnamentalDivider label="MANUSCRIPT BODY" className="mb-stack-md" />

          <div className="space-y-stack-md">
            {blocks.map((block, i) => {
              const meta2 = blockTypeMeta[block.type]
              return (
                <div key={i} className="glass-veil rounded-lg p-4">
                  {/* Block toolbar */}
                  <div className="mb-2 flex items-center justify-between border-b border-primary-container/10 pb-2">
                    <span className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-fixed-dim">
                      <Icon name={meta2.icon} size={14} />
                      {meta2.label}
                    </span>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <button
                        type="button"
                        aria-label="Move up"
                        onClick={() => moveBlock(i, -1)}
                        className="rotate-180 p-1 hover:text-primary-container"
                      >
                        <Icon name="arrow_forward" size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        onClick={() => moveBlock(i, 1)}
                        className="p-1 hover:text-primary-container"
                      >
                        <Icon name="arrow_forward" size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete block"
                        onClick={() => removeBlock(i)}
                        className="p-1 hover:text-error"
                      >
                        <Icon name="delete" size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Block fields */}
                  {block.type === 'paragraph' && (
                    <textarea
                      rows={3}
                      value={block.text}
                      onChange={updateBlock(i, 'text')}
                      placeholder="The essence of hunting lies not in the strike..."
                      className="w-full resize-y bg-transparent font-sans text-base text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none"
                    />
                  )}
                  {block.type === 'heading' && (
                    <input
                      type="text"
                      value={block.text}
                      onChange={updateBlock(i, 'text')}
                      placeholder="Refining the Impact"
                      className="w-full border-b border-primary-container/20 bg-transparent py-1 font-serif text-2xl text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                    />
                  )}
                  {block.type === 'divider' && (
                    <p className="text-center font-sans text-xs uppercase tracking-widest text-on-surface-variant/40">
                      — ornamental divider —
                    </p>
                  )}
                  {block.type === 'image' && (
                    <div className="space-y-stack-xs">
                      <input
                        type="text"
                        value={block.src}
                        onChange={updateBlock(i, 'src')}
                        placeholder="Image URL or /assets path"
                        className="w-full border-b border-primary-container/20 bg-transparent py-1 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                      />
                      <input
                        type="text"
                        value={block.caption}
                        onChange={updateBlock(i, 'caption')}
                        placeholder="Caption (optional)"
                        className="w-full border-b border-primary-container/20 bg-transparent py-1 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                      />
                    </div>
                  )}
                  {block.type === 'code' && (
                    <div className="space-y-stack-xs">
                      <input
                        type="text"
                        value={block.file}
                        onChange={updateBlock(i, 'file')}
                        placeholder="combat_parry_controller.gd"
                        className="w-full border-b border-primary-container/20 bg-transparent py-1 font-mono text-sm text-primary-container placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                      />
                      <textarea
                        rows={6}
                        value={block.code}
                        onChange={updateBlock(i, 'code')}
                        placeholder="extends Node&#10;## GDScript..."
                        className="w-full resize-y bg-transparent font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none"
                      />
                    </div>
                  )}
                  {block.type === 'callout' && (
                    <div className="space-y-stack-xs">
                      <input
                        type="text"
                        value={block.title}
                        onChange={updateBlock(i, 'title')}
                        placeholder="Field Note"
                        className="w-full border-b border-primary-container/20 bg-transparent py-1 font-sans text-sm font-semibold uppercase tracking-widest text-primary-container placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={updateBlock(i, 'text')}
                        placeholder="A short, sharp aside for the reader..."
                        className="w-full resize-y bg-transparent font-sans text-base italic text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add block palette */}
          <div className="mt-stack-md flex flex-wrap items-center gap-stack-xs">
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60">
              Insert block:
            </span>
            {Object.keys(blockTemplates).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="flex items-center gap-1.5 rounded border border-primary-container/30 px-3 py-1.5 font-sans text-xs uppercase tracking-widest text-primary-container transition-all hover:border-primary-container hover:shadow-[0_0_10px_rgba(232,196,97,0.2)]"
              >
                <Icon name={blockTypeMeta[type].icon} size={13} />
                {blockTypeMeta[type].label}
              </button>
            ))}
          </div>
        </section>

        {/* Static notice */}
        <p className="text-center font-sans text-xs uppercase tracking-widest text-on-surface-variant/40">
          Static design preview — nothing is saved yet. Persistence arrives with the backend
          (Phase 5).
        </p>
      </main>
    </PageLayout>
  )
}
