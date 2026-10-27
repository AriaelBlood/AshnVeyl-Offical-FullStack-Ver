import { useState } from 'react'
import { formatGDScript } from '../lib/gdscript/highlighter.js'
import '../lib/gdscript/gdscript-theme.css'
import Icon from './Icon.jsx'

/**
 * CodeBlock — glass-veil frame, file-tab header (mockup style),
 * GDScript syntax highlighting via the in-house highlighter, copy button.
 *
 * props:
 *   file  — file name shown in the header (e.g. 'combat_parry_controller.gd')
 *   lang  — label chip (e.g. 'GDScript 4.2')
 *   code  — raw GDScript source
 *   path  — optional full path shown in the header (e.g. 'res://scripts/combat/')
 */
export default function CodeBlock({ file, lang = 'GDScript 4.2', code, path = '' }) {
  const [copied, setCopied] = useState(false)
  const html = formatGDScript(code || '', { lineNumbers: true })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <figure className="my-stack-xl overflow-hidden rounded-xl border border-primary-container/20 bg-void/60 shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-primary-container/15 bg-void/90 px-4 py-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* Mac dots */}
          <div className="mr-2 flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold tracking-wide text-primary-container">
            {path}
            {file}
          </span>
          <span className="rounded border border-emerald-void/30 bg-emerald-void/10 px-1.5 py-0.5 text-[10px] text-emerald-void">
            {lang}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 text-primary-container/80 transition-colors hover:text-emerald-void"
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} />
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code body — highlighted HTML from the in-house GDScript highlighter */}
      <div className="gd-theme overflow-x-auto p-4 md:p-6">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </figure>
  )
}
