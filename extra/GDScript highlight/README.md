# GDScript Syntax Highlighter

A lightweight, consistent, and dependency-free syntax highlighter for **GDScript** (Godot 4.x & 3.x) with custom CSS styling and clean HTML output.

---

## 📁 File Structure

```text
.
├── css/
│   └── gdscript.css         # All-in-one stylesheet for all GDScript syntax elements
├── js/
│   └── highlighter.js       # GDScript tokenizer and HTML formatter
├── test/
│   └── test_highlighter.js  # Automated test suite
└── index.html               # Interactive playground / demo page
```

---

## 🎨 CSS Styling (`css/gdscript.css`)

All syntax categories are organized with distinct CSS classes and custom CSS variables for easy theming:

| Syntax Element | CSS Selector / Class | Default Color (Catppuccin theme) |
| :--- | :--- | :--- |
| **Container** | `#code-block` | Dark Navy (`#1e1e2e`) |
| **Comments** | `.gd-comment` | Muted Gray Italic (`#6c7086`) |
| **Strings** | `.gd-string` | Soft Green (`#a6e3a1`) |
| **Keywords** | `.gd-keyword` / `.gd-keyword-declaration`, `.gd-keyword-control` | Mauve / Rose (`#cba6f7`, `#eba0ac`) |
| **Decorators** | `.gd-decorator` | Golden Yellow (`#f9e2af`) |
| **Functions** | `.gd-function-name`, `.gd-function-call` | Sky Blue (`#89b4fa`) |
| **Classes & Types** | `.gd-class-name` | Coral Pink (`#f38ba8`) for all classes (`Sprite2D`, `AnimationPlayer`, `Vector2`, custom classes) |
| **Primitives** | `.gd-type` | Teal (`#94e2d5`) for `int`, `float`, `bool`, `void` |
| **NodePath References** | `.gd-nodepath` | Cyan (`#89dceb`) for `$Sprite2D`, `$AnimationPlayer`, `$"Path/To/Node"`, `$%UniqueNode` |
| **Numbers** | `.gd-number` | Peach (`#fab387`) |
| **Operators** | `.gd-operator` | Cyan (`#89dceb`) |
| **Built-in Consts** | `.gd-builtin-const` | Peach (`#fab387`) |
| **Punctuation** | `.gd-punctuation` | Slate (`#9399b2`) |
| **Line Numbers** | `.gd-line-number` | Faded Gray (`#585b70`) |

---

## 🚀 How to Use

### 1. In Static Websites (Zero Configuration)
Simply include the CSS and JS files, then write your GDScript directly inside any `<div id="code-block">` or `<div class="code-block">`:

```html
<link rel="stylesheet" href="css/gdscript.css">
<script src="js/highlighter.js"></script>

<!-- First block -->
<div id="code-block">
@onready var sprite: Sprite2D = $Sprite2D
@onready var anim: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
    print("Player is ready!")
</div>

<!-- Multiple blocks on the same page are automatically supported! -->
<div class="code-block">
func _physics_process(delta: float) -> void:
    velocity.y += 980.0 * delta
    move_and_slide()
</div>
```

On page load, `highlighter.js` automatically:
1. Finds all `#code-block, .code-block, [data-gdscript], pre.gdscript` elements.
2. Normalizes and dedents HTML indentation cleanly.
3. Formats each block with full syntax highlighting and line numbers.

---

### 2. In React Frontend Projects (Modular API)

The highlighter is written as pure, dependency-free JavaScript supporting ES Modules, CommonJS, and Browser environments.

#### Pattern A: Using `formatGDScript` (Recommended)
```jsx
import { formatGDScript } from './path/to/highlighter.js';
import './path/to/gdscript.css';

export function CodeBlock({ code }) {
  return (
    <div
      className="code-block"
      dangerouslySetInnerHTML={{ __html: formatGDScript(code, { lineNumbers: true }) }}
    />
  );
}
```

#### Pattern B: Using React `useRef` + `useEffect`
```jsx
import { useEffect, useRef } from 'react';
import { highlightElement } from './path/to/highlighter.js';
import './path/to/gdscript.css';

export function CodeBlock({ code }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      highlightElement(codeRef.current, { lineNumbers: true });
    }
  }, [code]);

  return <div ref={codeRef} className="code-block">{code}</div>;
}
```

#### Pattern C: Native React Elements (Pure Token Mapping)
```jsx
import { tokenizeGDScript } from './path/to/highlighter.js';
import './path/to/gdscript.css';

export function CodeBlock({ code }) {
  const tokens = tokenizeGDScript(code);

  return (
    <pre className="code-block">
      <code>
        {tokens.map((tok, i) => (
          <span key={i} className={`gd-${tok.type}`}>
            {tok.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
```

---

## 🧪 Testing

To run the automated test suite verifying all 12 test assertions:

```bash
node test/test_highlighter.js
```
