/**
 * GDScript Syntax Highlighter
 * Modular syntax highlighter for Godot 4.x / GDScript
 */

(function (global) {
  'use strict';

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const DECLARATION_KEYWORDS = new Set([
    'func', 'var', 'const', 'class', 'class_name', 'extends',
    'signal', 'enum', 'static'
  ]);

  const CONTROL_KEYWORDS = new Set([
    'if', 'elif', 'else', 'for', 'while', 'match', 'break',
    'continue', 'pass', 'return', 'await', 'assert', 'breakpoint',
    'as', 'is', 'in', 'not', 'and', 'or', 'void'
  ]);

  const BUILTIN_CONSTANTS = new Set([
    'true', 'false', 'null', 'self', 'super', 'PI', 'TAU', 'INF', 'NAN'
  ]);

  const BUILTIN_PRIMITIVE_TYPES = new Set([
    'int', 'float', 'bool', 'void'
  ]);

  /**
   * Automatically strips leading/trailing empty lines and common base indentation.
   * Allows writing clean, indented GDScript directly inside HTML tags.
   * @param {string} text
   * @returns {string}
   */
  function dedentCode(text) {
    if (!text) return '';
    const lines = text.split('\n');
    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    if (lines.length === 0) return '';

    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      const match = line.match(/^[ \t]*/);
      const indent = match ? match[0].length : 0;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }

    if (minIndent === Infinity || minIndent === 0) {
      return lines.join('\n');
    }

    return lines.map(line => {
      if (line.trim().length === 0) return '';
      return line.slice(minIndent);
    }).join('\n');
  }

  /**
   * Tokenize GDScript raw source code into structured tokens
   * @param {string} source
   * @returns {Array<{type: string, value: string}>}
   */
  function tokenizeGDScript(source) {
    const tokens = [];
    let i = 0;
    const len = source.length;

    while (i < len) {
      const ch = source[i];
      const rest = source.slice(i);

      // 1. Whitespace & Newlines
      if (ch === '\n') {
        tokens.push({ type: 'newline', value: '\n' });
        i++;
        continue;
      }
      if (/\s/.test(ch)) {
        let ws = '';
        while (i < len && /\s/.test(source[i]) && source[i] !== '\n') {
          ws += source[i++];
        }
        tokens.push({ type: 'whitespace', value: ws });
        continue;
      }

      // 2. Comments (# to end of line)
      if (ch === '#') {
        let comment = '';
        while (i < len && source[i] !== '\n') {
          comment += source[i++];
        }
        tokens.push({ type: 'comment', value: comment });
        continue;
      }

      // 3. Multiline Strings ("""...""" or '''...''')
      if (rest.startsWith('"""') || rest.startsWith("'''")) {
        const quote = rest.slice(0, 3);
        let str = quote;
        i += 3;
        while (i < len) {
          if (source.slice(i, i + 3) === quote) {
            str += quote;
            i += 3;
            break;
          }
          if (source[i] === '\\' && i + 1 < len) {
            str += source[i] + source[i + 1];
            i += 2;
          } else {
            str += source[i++];
          }
        }
        tokens.push({ type: 'string', value: str });
        continue;
      }

      // 4. Single-line Strings ("..." or '...')
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let str = quote;
        i++;
        while (i < len) {
          const c = source[i];
          if (c === quote) {
            str += quote;
            i++;
            break;
          }
          if (c === '\\' && i + 1 < len) {
            str += source[i] + source[i + 1];
            i += 2;
          } else if (c === '\n') {
            break;
          } else {
            str += c;
            i++;
          }
        }
        tokens.push({ type: 'string', value: str });
        continue;
      }

      // 5. Decorators / Annotations (@export, @onready, @tool, etc.)
      if (ch === '@') {
        const m = rest.match(/^@[a-zA-Z_][a-zA-Z0-9_]*/);
        if (m) {
          tokens.push({ type: 'decorator', value: m[0] });
          i += m[0].length;
          continue;
        }
      }

      // 6. NodePath literals ($Sprite2D, $AnimationPlayer, $"path/to/node", $'node', $%UniqueNode, %UniqueNode)
      if (ch === '$' || (ch === '%' && (i === 0 || /[\s,(=:;[]/.test(source[i - 1])))) {
        const nodeMatch = rest.match(/^(?:\$(?:%?[a-zA-Z_][a-zA-Z0-9_/]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|%[a-zA-Z_][a-zA-Z0-9_]*)/);
        if (nodeMatch) {
          tokens.push({ type: 'nodepath', value: nodeMatch[0] });
          i += nodeMatch[0].length;
          continue;
        }
      }

      // 7. Numbers (hex 0x..., bin 0b..., float, int)
      const numMatch = rest.match(/^(?:0x[0-9a-fA-F_]+|0b[01_]+|\d+[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?|\.[\d_]+(?:[eE][+-]?\d+)?)/);
      if (numMatch && (i === 0 || /[^a-zA-Z0-9_]/.test(source[i - 1]))) {
        tokens.push({ type: 'number', value: numMatch[0] });
        i += numMatch[0].length;
        continue;
      }

      // 8. Identifiers, Keywords, Functions, Classes
      const identMatch = rest.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (identMatch) {
        const word = identMatch[0];
        i += word.length;

        // Lookahead past whitespace for '(' to detect function call
        let j = i;
        while (j < len && (source[j] === ' ' || source[j] === '\t')) {
          j++;
        }
        const isFollowedByParen = (source[j] === '(');

        // Previous non-whitespace token
        let prevTok = null;
        for (let k = tokens.length - 1; k >= 0; k--) {
          if (tokens[k].type !== 'whitespace' && tokens[k].type !== 'newline') {
            prevTok = tokens[k];
            break;
          }
        }

        if (DECLARATION_KEYWORDS.has(word)) {
          tokens.push({ type: 'keyword-declaration', value: word });
        } else if (CONTROL_KEYWORDS.has(word)) {
          tokens.push({ type: 'keyword-control', value: word });
        } else if (BUILTIN_CONSTANTS.has(word)) {
          tokens.push({ type: 'builtin-const', value: word });
        } else if (BUILTIN_PRIMITIVE_TYPES.has(word)) {
          tokens.push({ type: 'type', value: word });
        } else if (prevTok && prevTok.type === 'keyword-declaration' && prevTok.value === 'func') {
          tokens.push({ type: 'function-name', value: word });
        } else if (prevTok && prevTok.type === 'keyword-declaration' && (prevTok.value === 'class' || prevTok.value === 'class_name' || prevTok.value === 'extends')) {
          tokens.push({ type: 'class-name', value: word });
        } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(word)) {
          // PascalCase identifiers (Sprite2D, AnimationPlayer, CharacterBody2D, Vector2, etc.) are Classes/Types
          tokens.push({ type: 'class-name', value: word });
        } else if (isFollowedByParen) {
          tokens.push({ type: 'function-call', value: word });
        } else {
          tokens.push({ type: 'identifier', value: word });
        }
        continue;
      }

      // 9. Multi-character and Single-character Operators
      const opMatch = rest.match(/^(?:->|==|!=|<=|>=|\+=|-=|\*=|\/=|%=|:=|\*\*|&&|\|\||<<|>>|[+\-*/%!=<>&|^~])/);
      if (opMatch) {
        tokens.push({ type: 'operator', value: opMatch[0] });
        i += opMatch[0].length;
        continue;
      }

      // 10. Punctuation
      if (/^[()[\]{},:;.]/.test(ch)) {
        tokens.push({ type: 'punctuation', value: ch });
        i++;
        continue;
      }

      // Fallback
      tokens.push({ type: 'text', value: ch });
      i++;
    }

    return tokens;
  }

  /**
   * Format tokens into syntax-highlighted HTML string
   * @param {Array<{type: string, value: string}>} tokens
   * @param {Object} options
   * @returns {string}
   */
  function formatTokensToHtml(tokens, options = {}) {
    const showLineNumbers = options.lineNumbers !== false;

    // Split tokens by newline into line arrays
    const lines = [[]];
    for (const token of tokens) {
      if (token.type === 'newline') {
        lines.push([]);
      } else {
        lines[lines.length - 1].push(token);
      }
    }

    const htmlLines = lines.map((lineTokens, lineIdx) => {
      const lineContent = lineTokens.map(tok => {
        const escaped = escapeHtml(tok.value);
        switch (tok.type) {
          case 'comment':
            return `<span class="gd-comment">${escaped}</span>`;
          case 'string':
            return `<span class="gd-string">${escaped}</span>`;
          case 'keyword-declaration':
            return `<span class="gd-keyword gd-keyword-declaration">${escaped}</span>`;
          case 'keyword-control':
            return `<span class="gd-keyword gd-keyword-control">${escaped}</span>`;
          case 'decorator':
            return `<span class="gd-decorator">${escaped}</span>`;
          case 'function-name':
            return `<span class="gd-function-name">${escaped}</span>`;
          case 'function-call':
            return `<span class="gd-function-call">${escaped}</span>`;
          case 'class-name':
            return `<span class="gd-class-name">${escaped}</span>`;
          case 'nodepath':
            return `<span class="gd-nodepath">${escaped}</span>`;
          case 'type':
            return `<span class="gd-type">${escaped}</span>`;
          case 'number':
            return `<span class="gd-number">${escaped}</span>`;
          case 'operator':
            return `<span class="gd-operator">${escaped}</span>`;
          case 'punctuation':
            return `<span class="gd-punctuation">${escaped}</span>`;
          case 'builtin-const':
            return `<span class="gd-builtin-const">${escaped}</span>`;
          case 'identifier':
            return `<span class="gd-identifier">${escaped}</span>`;
          case 'whitespace':
          default:
            return escaped;
        }
      }).join('');

      if (showLineNumbers) {
        return `<span class="gd-line"><span class="gd-line-number">${lineIdx + 1}</span>${lineContent}</span>`;
      }
      return `<span class="gd-line">${lineContent}</span>`;
    });

    return `<code>${htmlLines.join('\n')}</code>`;
  }

  /**
   * Pure formatter: takes raw GDScript code string, dedents it, tokenizes it,
   * and returns the highlighted HTML string. Ideal for React (dangerouslySetInnerHTML).
   *
   * @param {string} text - Raw GDScript code input
   * @param {Object} [options] - Options such as { lineNumbers: true }
   * @returns {string} The formatted HTML string
   */
  function formatGDScript(text, options = {}) {
    const clean = dedentCode(typeof text === 'string' ? text : '');
    const tokens = tokenizeGDScript(clean);
    return formatTokensToHtml(tokens, options);
  }

  /**
   * Highlights a single DOM element by taking its raw textContent,
   * dedenting it, and setting its innerHTML with formatted code.
   * Can be used in React with useRef in useEffect!
   *
   * @param {HTMLElement} element - Target DOM node
   * @param {Object} [options] - Options such as { lineNumbers: true }
   */
  function highlightElement(element, options = {}) {
    if (!element || element.dataset.gdHighlighted === 'true') return;
    const raw = element.textContent || '';
    const html = formatGDScript(raw, options);
    element.innerHTML = html;
    element.dataset.gdHighlighted = 'true';
  }

  /**
   * Auto-formats all matching code blocks on the page.
   * By default searches for '#code-block, .code-block, [data-gdscript], pre.gdscript, div.gdscript'
   *
   * @param {string} [selector] - Custom CSS selector
   * @param {Object} [options] - Formatting options
   */
  function highlightAll(selector, options = {}) {
    if (typeof document === 'undefined') return;
    const sel = selector || '#code-block, .code-block, [data-gdscript], pre.gdscript, div.gdscript';
    const elements = document.querySelectorAll(sel);
    elements.forEach(function (el) {
      highlightElement(el, options);
    });
  }

  /**
   * Highlights GDScript code and injects it into a target DOM element.
   * By default, injects into the element with id 'code-block'.
   *
   * @param {string} text - Raw GDScript code input
   * @param {string|HTMLElement} [targetElementOrId='code-block'] - ID or DOM element
   * @param {Object} [options] - Options such as { lineNumbers: true }
   * @returns {string} The generated HTML string
   */
  function highlightGDScript(text, targetElementOrId = 'code-block', options = {}) {
    const raw = typeof text === 'string' ? text : '';
    const html = formatGDScript(raw, options);

    if (typeof document !== 'undefined' && targetElementOrId) {
      const element = typeof targetElementOrId === 'string'
        ? document.getElementById(targetElementOrId)
        : targetElementOrId;

      if (element) {
        element.innerHTML = html;
        element.dataset.gdHighlighted = 'true';
      }
    }

    return html;
  }

  // Auto-run on DOM ready in browsers
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        highlightAll();
      });
    } else {
      setTimeout(function () {
        highlightAll();
      }, 0);
    }
  }

  // Export to namespace and global window
  const api = {
    tokenize: tokenizeGDScript,
    tokenizeGDScript: tokenizeGDScript,
    format: formatTokensToHtml,
    formatTokensToHtml: formatTokensToHtml,
    formatGDScript: formatGDScript,
    highlight: highlightGDScript,
    highlightGDScript: highlightGDScript,
    highlightElement: highlightElement,
    highlightAll: highlightAll,
    dedentCode: dedentCode
  };

  global.GDScript = Object.assign(global.GDScript || {}, api);

  // Direct top-level helper functions
  global.formatGDScript = formatGDScript;
  global.tokenizeGDScript = tokenizeGDScript;
  global.highlightGDScript = highlightGDScript;
  global.highlightElement = highlightElement;
  global.highlightAll = highlightAll;

  // (CommonJS export removed — this file is an ES module consumed by Vite/React)
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

// ES module exports (Vite / React import style)
const __gdApi = globalThis.GDScript;
export const formatGDScript = __gdApi.formatGDScript;
export const tokenizeGDScript = __gdApi.tokenizeGDScript;
export const dedentCode = __gdApi.dedentCode;
export default __gdApi;
