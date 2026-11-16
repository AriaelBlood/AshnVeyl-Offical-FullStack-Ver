import { useSeals } from '../lib/seals.jsx'

const socials = [
  { name: 'Twitter', href: '#' },
  { name: 'Discord', href: '#' },
  { name: 'Itch.io', href: 'https://ashn-veyl.itch.io/' },
  { name: 'Github', href: 'https://github.com/AriaelBlood' }, // the username will be changed soon~!!!
  { name: 'Press Kit', href: '#' },
]

export default function Footer() {
  const { clickDiamond, diamondTurns, sealState } = useSeals()

  return (
    <footer className="relative w-full border-t border-primary-container/10 bg-void">
      {/* Ornamental divider — the diamond is Seal I: click it 3 times */}
      <div className="absolute left-1/2 top-0 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="h-px w-1/3 bg-gradient-to-r from-transparent to-primary-container/30" />
        <button
          type="button"
          aria-label="Ornamental diamond"
          onClick={clickDiamond}
          className={`mx-2 h-3 w-3 rotate-45 border border-primary-container bg-void transition-all duration-300 ${
            diamondTurns === 1
              ? 'rotate-[90deg] shadow-[0_0_10px_rgba(232,196,97,0.6)]'
              : diamondTurns === 2
                ? 'rotate-[135deg] shadow-[0_0_12px_rgba(46,204,113,0.7)]'
                : sealState === 'armed'
                  ? 'shadow-[0_0_15px_rgba(46,204,113,0.8)]'
                  : ''
          }`}
        />
        <div className="h-px w-1/3 bg-gradient-to-l from-transparent to-primary-container/30" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 md:grid-cols-3 md:px-20">
        <div className="flex flex-col justify-between gap-4">
          <span className="text-lg font-black text-primary-container">ASHN VEYL</span>
          <span className="font-serif text-sm uppercase tracking-widest text-primary-container/70">
            © 2026 ASHN VEYL. ALL RIGHTS RESERVED IN THE VOID.
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-start gap-8 font-serif text-sm uppercase tracking-widest md:justify-end md:col-span-2">
          {socials.map(({ name, href }) => (
            <a key={name} href={href} className="text-stone-400 opacity-80 transition-opacity hover:text-primary-container hover:underline hover:opacity-100 decoration-primary-container/50">
              {name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
