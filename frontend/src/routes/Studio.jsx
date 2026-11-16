import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import OrnamentalDivider from '../components/OrnamentalDivider.jsx'
import PageLayout from '../components/PageLayout.jsx'
import { useAuth } from '../lib/auth.jsx'
import {
  createDevlog,
  deleteDevlog,
  fetchAdminDevlogs,
  fetchDevlog,
  updateDevlog,
} from '../lib/api.js'

/**
 * The Studio — post add/edit/publish UI, wired to the Vault API.
 *
 * Guarded: unauthenticated visitors are turned away.
 * Edit mode: /studio?edit=<slug> loads an existing manuscript (including drafts).
 *
 * Block-based body editor: paragraph / heading / code / image / divider / callout.
 * The blocks array is submitted to the backend 1:1 (contract: FRONTEND_HANDOFF.md §5).
 */

const emptyMeta = {
  _id: null,
  title: '',
  slug: '',
  category: '',
  readTime: '5 MIN READ',
  summary: '',
  image: '',
  featured: false,
  published: false,
}

const blockTemplates = {
  paragraph: { type: 'paragraph', text: '', lead: false },
  heading: { type: 'heading', text: '' },
  divider: { type: 'divider', label: '' },
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

function hydrateDoc(doc) {
  return {
    meta: {
      _id: doc._id || null,
      title: doc.title || '',
      slug: doc.slug || '',
      category: doc.category || '',
      readTime: doc.readTime || '5 MIN READ',
      summary: doc.summary || '',
      image: doc.image || '',
      featured: Boolean(doc.featured),
      published: Boolean(doc.published),
    },
    blocks:
      Array.isArray(doc.blocks) && doc.blocks.length > 0
        ? doc.blocks.map((b) => ({ ...blockTemplates[b.type], ...b }))
        : [{ ...blockTemplates.paragraph }],
  }
}

export default function Studio() {
  const { user, isAdmin, loading: authLoading, logout } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const editSlug = searchParams.get('edit')

  const [meta, setMeta] = useState(emptyMeta)
  const [blocks, setBlocks] = useState([{ ...blockTemplates.paragraph }])
  const [manuscripts, setManuscripts] = useState([])
  const [hydratedSlug, setHydratedSlug] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [notice, setNotice] = useState(null) // { kind: 'ok'|'err', text }

  const loadingDoc = Boolean(isAdmin && editSlug && hydratedSlug !== editSlug)

  const refreshManuscripts = useCallback(async () => {
    try {
      const list = await fetchAdminDevlogs()
      setManuscripts(Array.isArray(list) ? list : [])
    } catch {
      /* ignore list error if unavailable */
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return undefined
    let cancelled = false
    fetchAdminDevlogs()
      .then((list) => {
        if (!cancelled) setManuscripts(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        /* ignore list error if unavailable */
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  // Load ?edit=<slug> when present
  useEffect(() => {
    if (!isAdmin || !editSlug || hydratedSlug === editSlug) return undefined
    let cancelled = false
    fetchDevlog(editSlug)
      .then((doc) => {
        if (cancelled) return
        const hydrated = hydrateDoc(doc)
        setMeta(hydrated.meta)
        setBlocks(hydrated.blocks)
        setNotice(null)
        setHydratedSlug(editSlug)
      })
      .catch((err) => {
        if (!cancelled) {
          setNotice({ kind: 'err', text: err.message || 'Could not unroll manuscript for editing.' })
          setHydratedSlug(editSlug)
        }
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin, editSlug, hydratedSlug])

  const startNewManuscript = () => {
    setMeta({ ...emptyMeta })
    setBlocks([{ ...blockTemplates.paragraph }])
    setHydratedSlug(null)
    setNotice(null)
    setConfirmDeleteId(null)
    if (editSlug) setSearchParams({}, { replace: true })
  }

  const selectManuscript = (slug) => {
    setConfirmDeleteId(null)
    setNotice(null)
    setHydratedSlug(null)
    setSearchParams({ edit: slug })
  }

  const updateMeta = (key) => (e) => setMeta({ ...meta, [key]: e.target.value })

  const updateBlock = (i, key) => (e) => {
    const next = [...blocks]
    next[i] = { ...next[i], [key]: e.target.value }
    setBlocks(next)
  }

  const toggleBlockBool = (i, key) => {
    const next = [...blocks]
    next[i] = { ...next[i], [key]: !next[i][key] }
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

  const saveManuscript = async () => {
    setSaving(true)
    setNotice(null)
    try {
      const payload = {
        title: meta.title,
        slug: meta.slug || undefined, // backend auto-generates if omitted
        category: meta.category || undefined,
        readTime: meta.readTime || undefined,
        summary: meta.summary || undefined,
        image: meta.image.trim() || null,
        featured: meta.featured,
        published: meta.published,
        blocks,
      }
      const saved = meta._id
        ? await updateDevlog(meta._id, payload)
        : await createDevlog(payload)
      const hydrated = hydrateDoc(saved)
      setMeta(hydrated.meta)
      setBlocks(hydrated.blocks)
      setHydratedSlug(saved.slug)
      setSearchParams({ edit: saved.slug }, { replace: true })
      await refreshManuscripts()
      setNotice({
        kind: 'ok',
        text: `Manuscript sealed into the Vault (${saved.published ? 'published' : 'draft'}).`,
      })
    } catch (err) {
      setNotice({ kind: 'err', text: err.message || 'The Vault refused the manuscript.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (doc) => {
    setDeletingId(doc._id)
    setNotice(null)
    try {
      await deleteDevlog(doc._id)
      setConfirmDeleteId(null)
      if (meta._id === doc._id) {
        startNewManuscript()
      }
      await refreshManuscripts()
      setNotice({ kind: 'ok', text: `Manuscript "${doc.title}" purged from the Vault.` })
    } catch (err) {
      setNotice({ kind: 'err', text: err.message || 'Failed to delete manuscript.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <PageLayout>
      <main className="mx-auto max-w-4xl px-margin pb-stack-xl pt-stack-md">
        {/* Auth guard */}
        {authLoading ? (
          <p className="py-stack-xl text-center font-sans text-sm uppercase tracking-widest text-on-surface-variant/50">
            Consulting the Vault…
          </p>
        ) : !isAdmin ? (
          <section className="glass-veil mx-auto mt-stack-xl max-w-md rounded-lg p-8 text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
              Restricted Wings
            </p>
            <h2 className="mt-2 font-serif text-h3 text-primary-container">The door is sealed</h2>
            <p className="mt-3 font-sans text-base text-on-surface-variant">
              {user
                ? 'This identity does not hold the key to the Studio.'
                : 'Only the hunter may compose manuscripts here.'}
            </p>
            <Link
              to="/"
              className="mt-stack-md inline-block border-b border-primary-container/30 pb-1 font-sans text-sm text-primary-container hover:border-primary-container"
            >
              Return to the Archive
            </Link>
          </section>
        ) : (
          <>
            {/* Header */}
            <section className="mb-stack-xl text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary-fixed-dim">
                  The Studio // Restricted Wings
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-primary-container" />
              </div>
              <h1 className="mt-stack-md font-serif text-h1 text-primary">
                {meta._id ? 'Revise Manuscript' : 'Compose a Manuscript'}
              </h1>
              <div className="mt-stack-md flex flex-wrap items-center justify-center gap-4">
                <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60">
                  Signed in as <span className="text-primary-container">{user?.username}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded border border-primary-container/30 px-3 py-1 font-sans text-xs uppercase tracking-widest text-on-surface-variant transition-colors hover:border-error/60 hover:text-error"
                >
                  Seal the Vault (Logout)
                </button>
              </div>
            </section>

            {/* Vault Manuscripts Drawer */}
            <section className="glass-veil mb-stack-xl rounded-lg p-6">
              <div className="mb-stack-md flex flex-wrap items-center justify-between gap-3">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary-container">
                  Vault Manuscripts ({manuscripts.length})
                </p>
                <button
                  type="button"
                  onClick={startNewManuscript}
                  className="flex items-center gap-1.5 rounded border border-primary-container/40 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary-container transition-all hover:border-primary-container hover:shadow-[0_0_10px_rgba(232,196,97,0.2)]"
                >
                  <Icon name="edit" size={13} /> New Manuscript
                </button>
              </div>

              {manuscripts.length === 0 ? (
                <p className="font-sans text-sm text-on-surface-variant/60">
                  No manuscripts recorded in the Vault yet.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {manuscripts.map((doc) => {
                    const isCurrent = meta._id === doc._id
                    return (
                      <div
                        key={doc._id}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded border px-3 py-2 transition-colors ${
                          isCurrent
                            ? 'border-primary-container/60 bg-primary-container/10'
                            : 'border-primary-container/10 bg-void/40 hover:border-primary-container/30'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectManuscript(doc.slug)}
                          className="flex flex-1 flex-wrap items-center gap-2 text-left"
                        >
                          <span className="font-mono text-xs text-primary-container/70">
                            #{doc.number}
                          </span>
                          <span className="font-serif text-base text-on-surface hover:text-primary-container">
                            {doc.title}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest ${
                              doc.published
                                ? 'bg-secondary-container/20 text-emerald-void'
                                : 'bg-surface-container-high text-on-surface-variant/70'
                            }`}
                          >
                            {doc.published ? 'Published' : 'Draft'}
                          </span>
                          {doc.featured && (
                            <span className="rounded bg-primary-container/20 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-primary-container">
                              Featured
                            </span>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/devlogs/${doc.slug}`}
                            className="p-1 text-on-surface-variant/60 transition-colors hover:text-primary-container"
                            title="Preview manuscript"
                          >
                            <Icon name="open_in_new" size={14} />
                          </Link>
                          {confirmDeleteId === doc._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={deletingId === doc._id}
                                onClick={() => handleDelete(doc)}
                                className="rounded bg-error/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-error hover:bg-error/30 disabled:opacity-50"
                              >
                                {deletingId === doc._id ? 'Purging…' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Delete ${doc.title}`}
                              onClick={() => setConfirmDeleteId(doc._id)}
                              className="p-1 text-on-surface-variant/60 transition-colors hover:text-error"
                            >
                              <Icon name="delete" size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {loadingDoc ? (
              <p className="py-stack-xl text-center font-sans text-sm uppercase tracking-widest text-on-surface-variant/50">
                Unrolling manuscript from the Vault…
              </p>
            ) : (
              <>
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
                  {/* Slug + Category + Read Time */}
                  <div className="grid grid-cols-1 gap-stack-md md:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                        Slug (auto if blank)
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
                    <div>
                      <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={meta.readTime}
                        onChange={updateMeta('readTime')}
                        placeholder="5 MIN READ"
                        className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-sans text-base uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                      />
                    </div>
                  </div>
                  {/* Summary */}
                  <div>
                    <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                      Summary
                    </label>
                    <textarea
                      rows={2}
                      value={meta.summary}
                      onChange={updateMeta('summary')}
                      placeholder="A brief chronicle excerpt shown in the Archive feed..."
                      className="w-full resize-y border-b border-primary-container/40 bg-transparent px-1 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                    />
                  </div>
                  {/* Cover image URL */}
                  <div>
                    <label className="mb-1 block font-sans text-xs uppercase tracking-widest text-on-surface-variant/70">
                      Cover Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={meta.image}
                      onChange={updateMeta('image')}
                      placeholder="https://... or /assets/..."
                      className="w-full border-b border-primary-container/40 bg-transparent px-1 py-2 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                    />
                  </div>
                  {/* Featured + Publish toggles */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary-container/10 pt-stack-md">
                    <div className="flex items-center gap-6">
                      <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">
                        Status:{' '}
                        <span className={meta.published ? 'text-emerald-void' : 'text-primary-container'}>
                          {meta.published ? 'Published' : 'Draft'}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setMeta({ ...meta, featured: !meta.featured })}
                        className={`rounded border px-3 py-1 font-sans text-xs uppercase tracking-widest transition-colors ${
                          meta.featured
                            ? 'border-primary-container bg-primary-container/20 text-primary-container'
                            : 'border-primary-container/20 text-on-surface-variant/70 hover:border-primary-container/50'
                        }`}
                      >
                        {meta.featured ? '★ Featured Entry' : '☆ Mark Featured'}
                      </button>
                    </div>
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
                      {meta.published ? 'Published — click to unpublish' : 'Mark Ready to Publish'}
                    </button>
                  </div>
                </section>

                {/* Block editor */}
                <section className="mb-stack-xl">
                  <OrnamentalDivider label="MANUSCRIPT BODY" className="mb-stack-md" />

                  {/* Save bar */}
                  <div className="glass-veil mb-stack-md flex flex-wrap items-center justify-between gap-stack-md rounded-lg p-4">
                    {notice && (
                      <div className="flex flex-wrap items-center gap-3">
                        <p
                          className={`font-sans text-sm ${
                            notice.kind === 'ok' ? 'text-emerald-void' : 'text-error'
                          }`}
                        >
                          {notice.text}
                        </p>
                        {notice.kind === 'ok' && meta.slug && (
                          <Link
                            to={`/devlogs/${meta.slug}`}
                            className="font-sans text-xs font-semibold uppercase tracking-widest text-primary-container underline decoration-primary-container/50 hover:text-emerald-void"
                          >
                            Preview ↗
                          </Link>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={saveManuscript}
                      disabled={saving || !meta.title}
                      className="ml-auto flex items-center gap-2 rounded bg-primary-container px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest text-on-primary-container transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(46,204,113,0.5)] disabled:opacity-50"
                    >
                      <Icon name={saving ? 'timer' : 'save'} size={16} />
                      {saving ? 'Sealing…' : meta._id ? 'Update Manuscript' : 'Save to Vault'}
                    </button>
                  </div>

                  <div className="space-y-stack-md">
                    {blocks.map((block, i) => {
                      const meta2 = blockTypeMeta[block.type] || blockTypeMeta.paragraph
                      return (
                        <div key={i} className="glass-veil rounded-lg p-4">
                          {/* Block toolbar */}
                          <div className="mb-2 flex items-center justify-between border-b border-primary-container/10 pb-2">
                            <span className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary-fixed-dim">
                              <Icon name={meta2.icon} size={14} />
                              {meta2.label}
                            </span>
                            <div className="flex items-center gap-2 text-on-surface-variant">
                              {block.type === 'paragraph' && (
                                <button
                                  type="button"
                                  onClick={() => toggleBlockBool(i, 'lead')}
                                  className={`rounded border px-2 py-0.5 font-sans text-[10px] uppercase tracking-widest transition-colors ${
                                    block.lead
                                      ? 'border-primary-container bg-primary-container/20 text-primary-container'
                                      : 'border-primary-container/20 text-on-surface-variant/60 hover:text-primary-container'
                                  }`}
                                >
                                  Drop Cap
                                </button>
                              )}
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
                              value={block.text || ''}
                              onChange={updateBlock(i, 'text')}
                              placeholder="The essence of hunting lies not in the strike..."
                              className="w-full resize-y bg-transparent font-sans text-base text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none"
                            />
                          )}
                          {block.type === 'heading' && (
                            <input
                              type="text"
                              value={block.text || ''}
                              onChange={updateBlock(i, 'text')}
                              placeholder="Refining the Impact"
                              className="w-full border-b border-primary-container/20 bg-transparent py-1 font-serif text-2xl text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                            />
                          )}
                          {block.type === 'divider' && (
                            <input
                              type="text"
                              value={block.label || ''}
                              onChange={updateBlock(i, 'label')}
                              placeholder="Optional section label (e.g. MECHANICAL SCHEMATICS)"
                              className="w-full border-b border-primary-container/20 bg-transparent py-1 text-center font-sans text-xs uppercase tracking-[0.25em] text-primary-container placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                            />
                          )}
                          {block.type === 'image' && (
                            <div className="space-y-stack-xs">
                              <input
                                type="text"
                                value={block.src || ''}
                                onChange={updateBlock(i, 'src')}
                                placeholder="Image URL or /assets path"
                                className="w-full border-b border-primary-container/20 bg-transparent py-1 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                              />
                              <input
                                type="text"
                                value={block.alt || ''}
                                onChange={updateBlock(i, 'alt')}
                                placeholder="Alt text (optional)"
                                className="w-full border-b border-primary-container/20 bg-transparent py-1 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                              />
                              <input
                                type="text"
                                value={block.caption || ''}
                                onChange={updateBlock(i, 'caption')}
                                placeholder="Caption (optional)"
                                className="w-full border-b border-primary-container/20 bg-transparent py-1 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                              />
                            </div>
                          )}
                          {block.type === 'code' && (
                            <div className="space-y-stack-xs">
                              <div className="grid grid-cols-1 gap-stack-xs sm:grid-cols-3">
                                <input
                                  type="text"
                                  value={block.file || ''}
                                  onChange={updateBlock(i, 'file')}
                                  placeholder="combat_parry_controller.gd"
                                  className="border-b border-primary-container/20 bg-transparent py-1 font-mono text-sm text-primary-container placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none sm:col-span-2"
                                />
                                <input
                                  type="text"
                                  value={block.lang || ''}
                                  onChange={updateBlock(i, 'lang')}
                                  placeholder="gdscript"
                                  className="border-b border-primary-container/20 bg-transparent py-1 font-mono text-sm text-emerald-void placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                                />
                              </div>
                              <textarea
                                rows={6}
                                value={block.code || ''}
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
                                value={block.title || ''}
                                onChange={updateBlock(i, 'title')}
                                placeholder="Field Note"
                                className="w-full border-b border-primary-container/20 bg-transparent py-1 font-sans text-sm font-semibold uppercase tracking-widest text-primary-container placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none"
                              />
                              <textarea
                                rows={2}
                                value={block.text || ''}
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

                <p className="text-center font-sans text-xs uppercase tracking-widest text-on-surface-variant/40">
                  Connected to the Vault — manuscripts are saved live.
                </p>
              </>
            )}
          </>
        )}
      </main>
    </PageLayout>
  )
}