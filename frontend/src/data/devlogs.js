/**
 * Mock devlog data — structured blocks (per plan decision #3).
 * Maps 1:1 to a future GET /api/devlogs and GET /api/devlogs/:slug.
 *
 * WARNING : the backend need re-plan about how to add/edit/store data 
 *
 * Block types:
 *   { type: 'paragraph', text }
 *   { type: 'heading',   text }
 *   { type: 'divider',   label? }
 *   { type: 'image',     src, alt, caption? }
 *   { type: 'code',      file, lang, code }
 *   { type: 'callout',   title, text }
 */

export const devlogs = [
  {
    slug: 'the-nightmare-to-start',
    number: 1,
    title: 'Devlog #1: The Nightmare to Start !',
    date: 'OCTOBER 26, 2026',
    category: 'PLAYER SYSTEMS & ARCHITECTURE',
    readTime: '12 MIN READ',
    featured: true,
    summary:
      'A comprehensive retrospective on building a souls-like action engine from scratch in Godot 4. We trace the journey from sketching initial mobile inputs on a phone to solving frame data synchronization, input state machines, animation blending, and root-motion mechanics.',
    image: null, // placeholder gradient
    published: true,
    blocks: [
      {
        type: 'paragraph',
        lead: true,
        text: "The essence of creating a souls-like game as a solo indie developer lies not in imitating massive studio pipelines, but in finding raw, functional solutions within minimal tools. While most look to high-end engines with motion-matching and millions of vertices, we chose Godot for its open-source freedom, minimalist philosophy, and hospitality toward weird, custom solutions. Even more uniquely, this journey didn't begin on a high-end PC—it started entirely on a phone.",
      },
      { type: 'heading', text: 'Starting on a Phone: The Unified Input Pipeline' },
      {
        type: 'paragraph',
        text: 'With an old laptop out of commission, the project initialized on mobile. This forced a crucial foundational choice: building a custom touch-controller interface using geometry-based touch detection rather than rigid signals, feeding directly into Godot’s standard input action map. Because mobile inputs, keyboard bindings, and controllers all map down to the exact same global input actions, the player script never has to care whether a thumb is pressing a virtual button or a keyboard switch. That single decision prevented a massive rewrite down the road.',
      },
      { type: 'divider', label: 'ARCHITECTURAL SCHEMATICS' },
      { type: 'heading', text: 'The Global Environment & Camera Lock-On System' },
      {
        type: 'paragraph',
        text: 'Souls-like cameras are notoriously tightly bound to combat mechanics. Instead of letting the camera query the world or rely on fragile visibility enablers (which freeze and break when off-screen), enemies self-register into a global Environment autoload script based on screen presence and distance. Target switching utilizes precise screen-position mapping rather than world distance, mirroring player intuition.',
      },
      {
        type: 'code',
        file: 'environment_target_collector.gd',
        lang: 'gdscript',
        code: `extends Node
## Global Environment Autoload — Handles target registration via screen visibility.
## Prevents freezing bugs associated with VisibleOnScreenEnabler3D.

var active_targets: Array[Node3D] = []

func register_target(target: Node3D) -> void:
    if not active_targets.has(target):
        active_targets.append(target)

func unregister_target(target: Node3D) -> void:
    active_targets.erase(target)

func get_best_target(screen_center: Vector2, direction: Vector2) -> Node3D:
    # Resolves target selection based on screen coordinate vectors and directional input flick
    var closest_target: Node3D = null
    var min_distance := INF
    for target in active_targets:
        if not is_instance_valid(target): continue
        # Screen position mapping and tolerance filtering logic
        var dist = screen_center.distance_to(target.get_screen_position())
        if dist < min_distance:
            min_distance = dist
            closest_target = target
    return closest_target`,
      },
      {
        type: 'callout',
        title: 'Field Note',
        text: 'Switching from VisibleOnScreenEnabler3D to VisibleOnScreenNotifier3D saved the lock-on system. Enablers freeze the node right when you need it to stay trackable off-camera edges.',
      },
      { type: 'heading', text: 'Input States, Speed Modifiers, and State Machine Refactors' },
      {
        type: 'paragraph',
        text: 'Simple boolean flags fail when dealing with complex action loops that require tracking start, ongoing, and end phases of input. Moving to an input state machine architecture allowed individual actions to manage their own logic. Furthermore, speed was restructured from a primary input into a modifier state—resembling Blender’s modifier key workflows—allowing fluid integration with movement states without breaking character acceleration.',
      },
      { type: 'heading', text: 'Physics, Root Motion, and Animation Blending' },
      {
        type: 'paragraph',
        text: 'A major hurdle in combat implementation was reconciling physics velocity with animation root motion. When both tried to move the character simultaneously without coordination, the character glided across floors like ice. The fix was definitive: animations own position exclusively during active root-motion frames, while physics takes over everywhere else.',
      },
      {
        type: 'paragraph',
        text: 'Godot’s default crossfading smears the critical first frames of an attack wind-up. To solve this, entry code explicitly forces transition crossfade times to zero for immediate frame data execution, backed by manual animation blending in Blender for the initial swing frames of light and heavy attacks. Continuous actions like blocking introduced unique challenges, such as infinite state-canceling loops upon landing while holding guard, which were ironed out by explicitly verifying current active states before firing action requests.',
      },
      {
        type: 'callout',
        title: 'Milestone Reached',
        text: 'The project now features a fully playable prototype level supporting mobile and PC platforms, featuring responsive spatial movement, modular light/heavy/air/land combo attacks, dynamic camera tracking, and functional blocking mechanics.',
      },
    ],
  },
  {
    slug: 'devlog-14-the-blood-slicked-combat-update',
    number: 14,
    title: 'Devlog #14: The Blood-Slicked Combat Update',
    date: 'OCTOBER 31, 2024',
    category: 'COMBAT SYSTEMS',
    readTime: '8 MIN READ',
    featured: false,
    summary:
      'In this iteration, the mechanics of visceral engagement have been refined. We delve into the animation state machines, impact frames, and the subtle art of making every strike feel dangerously consequential within the void.',
    image: null, // placeholder gradient
    published: true,
    blocks: [
      {
        type: 'paragraph',
        lead: true,
        text: "The essence of hunting lies not in the strike, but in the weight of the steel against the void. In our latest iteration of the combat engine, we have focused on tactile feedback and the kinetic energy of every movement. The Archive must breathe through the violence it records.",
      },
      { type: 'heading', text: 'Refining the Impact' },
      {
        type: 'paragraph',
        text: 'We’ve introduced a new "Impact Frame" system. When a blade meets the ethereal flesh of a nightmare, the engine now calculates resistance based on the creature\'s density. This isn\'t just a visual flash; it\'s a structural pause in the animation that communicates the physical struggle of the hunt.',
      },
      { type: 'divider', label: 'MECHANICAL SCHEMATICS' },
      { type: 'heading', text: 'Animation State & Kinetic Parry Subsystem' },
      {
        type: 'paragraph',
        text: 'Our combat pipeline handles parrying through sub-frame kinematic interception rather than conventional collision overlap. Below is the active production implementation handling kinetic density scaling, directional tolerance vectors, and emerald counter windows.',
      },
      {
        type: 'code',
        file: 'combat_parry_controller.gd',
        lang: 'gdscript',
        code: `extends Node
## Kinetic Parry Subsystem — Devlog #14
## Handles sub-frame interception windows and density scaling.

const PARRY_WINDOW := 0.12     # seconds of active interception
const DENSITY_SCALE := 1.35    # resistance multiplier per flesh tier

var _window_timer: float = 0.0
var _is_active: bool = false

func _ready() -> void:
    EventBus.parry_attempt.connect(_on_parry_attempt)

func _process(delta: float) -> void:
    if _is_active:
        _window_timer -= delta
        if _window_timer <= 0.0:
            _close_window()

func _on_parry_attempt(attack: AttackData) -> void:
    var resistance := attack.density * DENSITY_SCALE
    if _window_timer > 0.0 and attack.direction.matches_tolerance():
        # Emerald counter window: refund stamina, open retaliation frame
        Stamina.refund(resistance * 0.5)
        HitstopManager.freeze(resistance * 0.08)
        EventBus.parry_success.emit(attack)
    else:
        _close_window()`,
      },
      {
        type: 'callout',
        title: 'Field Note',
        text: 'Hitstop duration scales with victim density — hunting wisps feels weightless, hunting husks feels like splitting wet timber.',
      },
    ],
  },
  {
    slug: 'devlog-13-architectures-of-the-abyss',
    number: 13,
    title: 'Devlog #13: Architectures of the Abyss — Level Design',
    date: 'OCTOBER 12, 2024',
    category: 'LEVEL DESIGN',
    readTime: '6 MIN READ',
    featured: false,
    summary:
      'Structuring non-linear paths in an environment designed to disorient and oppress the player\'s senses.',
    image: null,
    published: true,
    blocks: [
      {
        type: 'paragraph',
        lead: true,
        text: 'A labyrinth is only terrifying when it pretends to be a corridor. This entry charts the blueprint phase of the Cathedral Rift — the geometry of getting lost on purpose.',
      },
      { type: 'heading', text: 'Drawing in Gold' },
      {
        type: 'paragraph',
        text: 'Every map begins as a single etched line on black parchment. Branches multiply until the route becomes a choice, and every choice becomes a wound.',
      },
    ],
  },
  {
    slug: 'devlog-12-inventory-systems-and-the-grimoire-ui',
    number: 12,
    title: 'Devlog #12: Inventory Systems & The Grimoire UI',
    date: 'SEPTEMBER 28, 2024',
    category: 'UI SYSTEMS',
    readTime: '5 MIN READ',
    featured: false,
    summary:
      'Translating complex item management into a tactile, diegetic experience that feels like reading an ancient tome.',
    image: null,
    published: true,
    blocks: [
      {
        type: 'paragraph',
        lead: true,
        text: 'The inventory is not a menu. It is a grimoire — and reading it should feel like an incantation, not a spreadsheet.',
      },
      { type: 'heading', text: 'Weight & Wonder' },
      {
        type: 'paragraph',
        text: 'Items are etched, not rendered. Each occupies a hand-drawn slot, and encumbrance is shown as ink saturating the page margins.',
      },
    ],
  },
  {
    slug: 'devlog-11-auditory-hallucinations',
    number: 11,
    title: 'Devlog #11: Auditory Hallucinations — Sound Design',
    date: 'SEPTEMBER 09, 2024',
    category: 'SOUND DESIGN',
    readTime: '7 MIN READ',
    featured: false,
    summary:
      'Crafting the ambient soundscape of the void. Layering distorted choir whispers with industrial drones.',
    image: null,
    published: true,
    blocks: [
      {
        type: 'paragraph',
        lead: true,
        text: 'Silence is the loudest instrument in the archive. Everything beneath it is carved from whispers and drones.',
      },
      { type: 'heading', text: 'Choirs in the Machine' },
      {
        type: 'paragraph',
        text: 'The base drone is a detuned cathedral recording fed through a bitcrusher. Twelve voices, one despair.',
      },
    ],
  },
]
