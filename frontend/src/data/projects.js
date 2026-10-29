/**
 * Mock project data — mirrors the Codex mockup.
 * Designed to map 1:1 to a future GET /api/projects response.
 */
export const projects = [
  { // this contain some real data name , link , status engine
    id: 'dungeon-crush',
    title: 'Dungeon Crush',
    category: 'games',
    type: 'DARK RPG',
    engine: 'GODOT 4.4',
    status: 'DISCONTINUED!',
    live: true,
    description:
      'A knight try to escape the dungeon the It shrinks each time. With limited resources.',
    image: null, // placeholder gradient
    links: { prototype: 'https://ashn-veyl.itch.io/dungeon-crush' /* Real Link!!! and Should be Release Build not prototype */},
    devlogLabel: null,
  },
  {
    id: 'crown-of-the-hollow-king',
    title: 'Crown of the Hollow King',
    category: 'games',
    type: 'FLAGSHIP RPG',
    engine: 'GODOT 4.2',
    status: 'ALPHA v0.42',
    live: true,
    description:
      'Gothic Souls-like combat framework featuring kinematic hitstop parrying, spatial audio echoes, and custom vertex cloth physics.',
    image: null, // placeholder gradient
    links: { prototype: '#', devlog: '/devlogs/devlog-14-the-blood-slicked-combat-update' },
    devlogLabel: 'Devlog #14 ↗',
  },
  {
    id: 'echoes-of-the-bell-tower',
    title: 'Echoes of the Bell-Tower',
    category: 'games',
    type: 'ATMOSPHERIC HORROR',
    engine: 'GODOT 4.2',
    status: 'PROTOTYPE',
    live: false,
    description:
      'A vertical-slice horror experience built around sound propagation. The bell tolls are the only map you get.',
    image: null,
    links: { prototype: '#', devlog: '#' },
    devlogLabel: 'Devlog #11 ↗',
  },
  {
    id: 'ember-drift',
    title: 'Ember Drift',
    category: 'games',
    type: 'ARCADE RACER',
    engine: 'GODOT 4.2',
    status: 'SHIPPED',
    live: true,
    description:
      'The completed one. A neon-obsidian drift racer released on itch.io — small, sharp, and done on purpose.',
    image: null,
    links: { prototype: 'https://itch.io' },
    devlogLabel: null,
  },
  {
    id: 'hunter-study-01',
    title: 'The Hunter — Character Study 01',
    category: 'art',
    type: 'CHARACTER DESIGN',
    engine: null,
    status: null,
    live: false,
    description:
      'Victorian hunter render study: tattered leather duster, ornate longsword, tricorn — candlelit gothic minimalism.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: null,
  },
  {
    id: 'abyss-blueprint',
    title: 'Architectures of the Abyss',
    category: 'art',
    type: 'LEVEL BLUEPRINT',
    engine: null,
    status: null,
    live: false,
    description:
      'Ornate map etchings on dark parchment — glowing geometric level layouts in muted gold over pitch black.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: 'Devlog #13 ↗',
  },
  {
    id: 'grimoire-ui',
    title: 'The Grimoire UI Kit',
    category: 'art',
    type: 'INTERFACE DESIGN',
    engine: null,
    status: null,
    live: false,
    description:
      'Inventory screen concepts blending modern minimalism with gothic horror — 1px gold etching on deep obsidian.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: 'Devlog #12 ↗',
  },
  {
    id: 'parry-breakdown',
    title: 'Kinetic Parry — Motion Breakdown',
    category: 'motion',
    type: 'ANIMATION STUDY',
    engine: 'GODOT 4.2',
    status: null,
    live: false,
    description:
      'Frame-by-frame teardown of the sub-frame kinematic parry system, from anticipation frames to hitstop recovery.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: 'Devlog #14 ↗',
  },
  {
    id: 'void-soundscape',
    title: 'Auditory Hallucinations',
    category: 'motion',
    type: 'SOUND DESIGN REEL',
    engine: null,
    status: null,
    live: false,
    description:
      'Layering distorted choir whispers with industrial drones — the ambient soundscape of the void.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: 'Devlog #11 ↗',
  },
  {
    id: 'combat-trailer',
    title: 'Blood-Slicked — Combat Teaser',
    category: 'motion',
    type: 'TRAILER CUT',
    engine: null,
    status: null,
    live: false,
    description:
      '60-second teaser cut from combat capture footage. Impact frames on the beat, silence between.',
    image: null,
    links: { prototype: '#' },
    devlogLabel: 'Devlog #14 ↗',
  },
]

export const categories = [
  { id: 'all', label: 'All Works' },
  { id: 'games', label: 'Game Projects' },
  { id: 'art', label: 'Independent Art' },
  { id: 'motion', label: 'Animation & Video' },
]
