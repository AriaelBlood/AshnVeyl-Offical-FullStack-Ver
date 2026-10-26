const socials = ['Twitter' , 'Discord', 'Itch.io', 'Press Kit']

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-primary-container/10 bg-void">
      {/* Ornamental divider */}
      <div className="absolute left-1/2 top-0 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="h-px w-1/3 bg-gradient-to-r from-transparent to-primary-container/30" />
        <div className="mx-2 h-3 w-3 rotate-45 border border-primary-container bg-void" />
        <div className="h-px w-1/3 bg-gradient-to-l from-transparent to-primary-container/30" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-20 py-16 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-4">
          <span className="text-lg font-black text-primary-container">ASHN VEYL</span>
          <span className="font-serif text-sm uppercase tracking-widest text-primary-container/70">
            © 2026 ASHN VEYL. ALL RIGHTS RESERVED IN THE VOID.
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-start gap-8 font-serif text-sm uppercase tracking-widest md:justify-end md:col-span-2">
          {socials.map((s) => (
            <a
              key={s}
              href="#"
              className="text-stone-400 opacity-80 transition-opacity hover:text-primary-container hover:underline hover:opacity-100 decoration-primary-container/50"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
