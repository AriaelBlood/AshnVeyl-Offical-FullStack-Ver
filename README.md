# AshnVeyl — Official Website (Full Stack Version)

> **Note:** This project was built with the help of AI to speed up the development process and improve workflow productivity.

The personal website of **AshnVeyl**, a solo game developer — sharing games, art, and devlogs online. Designed in a dark "Obsidian & Gold" style: a Victorian-horror-meets-minimalism aesthetic with glassmorphism, ornamental gold dividers, and an in-house GDScript syntax highlighter.

## Project Structure

```
.
├── frontend/     # React + Vite + Tailwind CSS v4 client
├── backend/      # API server (planned — Phase 5)
├── extra/        # Experiments (standalone GDScript syntax highlighter prototype)
└── context/      # Design system, mockups, plans — ignored by git
```

## Tech Stack (Frontend)

- **React 19** + **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7**
- In-house **GDScript syntax highlighter** (no external highlighting library)
- Inline SVG icon set (no icon fonts)

## Getting Started

```bash
# from the frontend/ folder
cd frontend
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # oxlint
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, featured devlog, latest entries |
| `/devlogs` | All devlog manuscripts |
| `/devlogs/:slug` | Individual devlog article with highlighted GDScript code blocks |
| `/projects` | The Codex — games, art, and motion works (filterable) |
| `/studio` | Post editor (static design preview; real persistence comes with the backend) |

## Roadmap

- [x] Phase 0 — Foundations (router, Tailwind, design tokens)
- [x] Phase 1 — Shared components
- [x] Phase 2 — Pages with mock data + static Studio editor
- [x] Phase 3 — GDScript highlighter integration
- [ ] Phase 4 — Responsive & accessibility polish + README *(this phase)*
- [ ] Phase 5 — Backend API + real content management

## License

All rights reserved © 2026 AshnVeyl.
