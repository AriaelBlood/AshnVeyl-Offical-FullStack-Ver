const assert = require('assert');
const { tokenizeGDScript, formatTokensToHtml, formatGDScript, highlightGDScript, dedentCode } = require('../js/highlighter.js');

console.log('Testing GDScript Syntax Highlighter...\n');

// 1. Test Comment
const commentTest = '# This is a comment\nvar x = 10';
const commentTokens = tokenizeGDScript(commentTest);
assert(commentTokens.some(t => t.type === 'comment' && t.value === '# This is a comment'), 'Comment not recognized');
console.log('✓ Comment recognized');

// 2. Test String
const stringTest = 'var name: String = "Hello Godot"';
const stringTokens = tokenizeGDScript(stringTest);
assert(stringTokens.some(t => t.type === 'string' && t.value === '"Hello Godot"'), 'String not recognized');
console.log('✓ String recognized');

// 3. Test Keywords
const kwTest = 'func _ready() -> void:\n    if true:\n        return';
const kwTokens = tokenizeGDScript(kwTest);
assert(kwTokens.some(t => t.type === 'keyword-declaration' && t.value === 'func'), 'func keyword not recognized');
assert(kwTokens.some(t => t.type === 'keyword-control' && t.value === 'if'), 'if keyword not recognized');
assert(kwTokens.some(t => t.type === 'keyword-control' && t.value === 'return'), 'return keyword not recognized');
console.log('✓ Keywords recognized');

// 4. Test Decorator / Annotation
const decTest = '@export_range(0, 100) var speed: float = 50.0\n@onready var sprite = $Sprite';
const decTokens = tokenizeGDScript(decTest);
assert(decTokens.some(t => t.type === 'decorator' && t.value === '@export_range'), '@export_range not recognized');
assert(decTokens.some(t => t.type === 'decorator' && t.value === '@onready'), '@onready not recognized');
console.log('✓ Decorators / Annotations recognized');

// 5. Test Functions (declaration and call)
const funcTest = 'func calculate_total(a, b):\n    print(a + b)';
const funcTokens = tokenizeGDScript(funcTest);
assert(funcTokens.some(t => t.type === 'function-name' && t.value === 'calculate_total'), 'Function definition not recognized');
assert(funcTokens.some(t => t.type === 'function-call' && t.value === 'print'), 'Function call not recognized');
console.log('✓ Function declaration and calls recognized');

// 6. Test Classes and Types
const classTest = 'class_name Player\nextends CharacterBody2D\nvar pos: Vector2\nvar count: int';
const classTokens = tokenizeGDScript(classTest);
assert(classTokens.some(t => t.type === 'class-name' && t.value === 'Player'), 'Class name not recognized');
assert(classTokens.some(t => t.type === 'class-name' && t.value === 'CharacterBody2D'), 'Extends class name not recognized');
assert(classTokens.some(t => t.type === 'class-name' && t.value === 'Vector2'), 'Class Vector2 not recognized');
assert(classTokens.some(t => t.type === 'type' && t.value === 'int'), 'Primitive type int not recognized');
console.log('✓ Classes and Types recognized');

// 7. Test Numbers
const numTest = 'var a = 42\nvar b = 3.1415\nvar c = 0xff00\nvar d = 0b1010';
const numTokens = tokenizeGDScript(numTest);
assert(numTokens.some(t => t.type === 'number' && t.value === '42'), 'Integer not recognized');
assert(numTokens.some(t => t.type === 'number' && t.value === '3.1415'), 'Float not recognized');
assert(numTokens.some(t => t.type === 'number' && t.value === '0xff00'), 'Hex number not recognized');
assert(numTokens.some(t => t.type === 'number' && t.value === '0b1010'), 'Binary number not recognized');
console.log('✓ Numbers (int, float, hex, bin) recognized');

// 8. Test Operators
const opTest = 'if a == b and c != d:\n    x += y * 2';
const opTokens = tokenizeGDScript(opTest);
assert(opTokens.some(t => t.type === 'operator' && t.value === '=='), '== operator not recognized');
assert(opTokens.some(t => t.type === 'operator' && t.value === '!='), '!= operator not recognized');
assert(opTokens.some(t => t.type === 'operator' && t.value === '+='), '+= operator not recognized');
assert(opTokens.some(t => t.type === 'operator' && t.value === '*'), '* operator not recognized');
console.log('✓ Operators recognized');

// 9. Test HTML Output Generation
const html = formatTokensToHtml(tokenizeGDScript('@export var player: CharacterBody2D\n# test\nfunc run():\n    print("go")'));
assert(html.includes('class="gd-decorator"'), 'HTML missing decorator class');
assert(html.includes('class="gd-keyword gd-keyword-declaration"'), 'HTML missing keyword class');
assert(html.includes('class="gd-comment"'), 'HTML missing comment class');
assert(html.includes('class="gd-function-name"'), 'HTML missing function name class');
assert(html.includes('class="gd-function-call"'), 'HTML missing function call class');
assert(html.includes('class="gd-string"'), 'HTML missing string class');
console.log('✓ HTML output contains all expected CSS classes');

// 10. Bug 3 Fix Verification: Sprite2D and AnimationPlayer MUST have the same color as types
const typeBugTest = 'var sprite: Sprite2D\nvar animation_player: AnimationPlayer';
const typeBugTokens = tokenizeGDScript(typeBugTest);
const spriteType = typeBugTokens.find(t => t.value === 'Sprite2D');
const animType = typeBugTokens.find(t => t.value === 'AnimationPlayer');
assert(spriteType && spriteType.type === 'class-name', 'Sprite2D should be class-name');
assert(animType && animType.type === 'class-name', 'AnimationPlayer should be class-name');
assert.strictEqual(spriteType.type, animType.type, 'Sprite2D and AnimationPlayer types must have identical token type and class');
console.log('✓ Bug 3 Fixed (Type position): Sprite2D and AnimationPlayer share identical "class-name" styling');

// 11. Bug 3 Fix Verification: $Sprite2D and $AnimationPlayer MUST have the same color as NodePath references
const nodeBugTest = 'var a = $Sprite2D\nvar b = $AnimationPlayer';
const nodeBugTokens = tokenizeGDScript(nodeBugTest);
const spriteRef = nodeBugTokens.find(t => t.value === '$Sprite2D');
const animRef = nodeBugTokens.find(t => t.value === '$AnimationPlayer');
assert(spriteRef && spriteRef.type === 'nodepath', '$Sprite2D must be recognized as nodepath');
assert(animRef && animRef.type === 'nodepath', '$AnimationPlayer must be recognized as nodepath');
assert.strictEqual(spriteRef.type, animRef.type, '$Sprite2D and $AnimationPlayer must have identical token type and class');

const nodeHtml = formatGDScript(nodeBugTest);
assert(nodeHtml.includes('<span class="gd-nodepath">$Sprite2D</span>'), 'Missing gd-nodepath for $Sprite2D');
assert(nodeHtml.includes('<span class="gd-nodepath">$AnimationPlayer</span>'), 'Missing gd-nodepath for $AnimationPlayer');
console.log('✓ Bug 3 Fixed (Reference position): $Sprite2D and $AnimationPlayer share identical "gd-nodepath" styling');

// 12. Test Dedent functionality for inline HTML code blocks
const indentedCode = `
    func _ready():
        print("Hello")
`;
const dedented = dedentCode(indentedCode);
assert.strictEqual(dedented, 'func _ready():\n    print("Hello")', 'Dedent failed to normalize whitespace');
console.log('✓ Dedent logic normalizes inline HTML indentation cleanly');

console.log('\nAll 12 tests PASSED successfully!');
