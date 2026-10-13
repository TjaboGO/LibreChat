# Browser-Use Architecture & DOM Extraction

> **Upstream Source:** [Browser-Use](https://github.com/browser-use/browser-use)  
> **Original License:** MIT License (Copyright (c) 2024 Gregor Zunic)  
> **Extraction Target:** LibreChat Browser Operator Skill & Playwright MCP Pipeline

---

## 1. Executive Summary & Core Philosophy

Browser-Use is the standard open-source library for controlling web browsers with LLMs via CDP (Chrome DevTools Protocol). Its key architectural innovations include:
1. **DOM Tree Indexing & Serialization:** Instead of feeding raw HTML or large DOM trees into the model, Browser-Use serializes visible, interactive DOM nodes into an indexed tree:
   ```text
   [33]<div />
       User form
       [35]<input type=text placeholder=Enter name />
       *[38]<button aria-label=Submit form />
           Submit
   ```
2. **Delta Tracking (`*[index]`):** Elements that appeared as a direct consequence of the previous step (such as autocomplete popups, modal dialogs, or dropdown options) are flagged with an asterisk `*`. This guides the agent to immediately interact with the newly revealed options.
3. **Action Chaining & Page-Change Boundary:** Safe actions (`input`, `scroll`, `find_elements`) can be chained in a single step (e.g. fill name, fill email, then click). Any page-changing action (`navigate`, `switch_tab`, form submit that triggers navigation) halts subsequent actions so the agent inspects the new DOM snapshot.
4. **Pre-Done Verification Checklist:** The agent is forbidden from asserting `success=true` without explicitly checking all requirements (item count, filters applied, form submission confirmation) against the live page state.

---

## 2. Key Code Extractions

### 2.1 DOM Indexing & Serialization (`browser_use/dom/serializer/serializer.py`)

Browser-Use parses DOM nodes and assigns unique indices to interactive elements:

```python
# Source: browser_use/dom/serializer/serializer.py (MIT, Gregor Zunic)
class DOMTreeSerializer:
    PROPAGATING_ELEMENTS = [
        {'tag': 'a', 'role': None},
        {'tag': 'button', 'role': None},
        {'tag': 'div', 'role': 'button'},
        {'tag': 'div', 'role': 'combobox'},
        {'tag': 'span', 'role': 'button'},
        {'tag': 'span', 'role': 'combobox'},
        {'tag': 'input', 'role': 'combobox'},
    ]

    def _assign_interactive_indices_and_mark_new_nodes(self, node: SimplifiedNode | None) -> None:
        if not node or node.excluded_by_parent or node.ignored_by_paint_order:
            return

        is_interactive = self._is_interactive_cached(node.original_node)
        is_visible = node.original_node.snapshot_node and node.original_node.is_visible
        is_scrollable = node.original_node.is_actually_scrollable

        # Scrollable container vs clickable element indexing
        if is_scrollable and not self._has_interactive_descendants(node):
            should_make_interactive = True
        elif is_interactive and (is_visible or is_file_input or is_shadow_dom_element):
            should_make_interactive = True
```

Formatting the serialized tree for LLM context:

```python
# Source: browser_use/dom/serializer/serializer.py (MIT, Gregor Zunic)
line = f'{depth_str}{shadow_prefix}'
if node.is_interactive:
    assert node.selector_index is not None
    new_prefix = '*' if node.is_new else ''
    scroll_prefix = '|scroll element[' if should_show_scroll else '['
    line += f'{new_prefix}{scroll_prefix}{node.selector_index}]<{node.original_node.tag_name}'
```

### 2.2 Prompt Rules & Verification (`browser_use/agent/system_prompts/system_prompt.md`)

Browser-Use enforces strict execution protocols:

```markdown
<!-- Source: browser_use/agent/system_prompts/system_prompt.md (MIT, Gregor Zunic) -->
<browser_rules>
Strictly follow these rules while using the browser:
- Only interact with elements that have a numeric [index] assigned.
- Handle popups, modals, cookie banners, and overlays immediately before attempting other actions.
- Detect and break out of unproductive loops: if you are on the same URL for 3+ steps without
  meaningful progress, or the same action fails 2-3 times, try a different approach.
- For autocomplete/combobox fields: type search text, then WAIT for suggestions dropdown
  (marked with *[) before selecting.
</browser_rules>

<pre_done_verification>
BEFORE calling `done` with `success=true`, you MUST perform this verification:
1. Re-read USER REQUEST — list every concrete requirement (items to find, filters to apply).
2. Check each requirement against results: correct number of items, all filters applied.
3. Verify actions actually completed (form submission confirmation on page state).
4. Verify data grounding: Every URL, price, name must appear verbatim on page. Never fabricate.
5. If ANY requirement is unmet or uncertain — set `success=false`.
</pre_done_verification>
```

### 2.3 Action Registry (`browser_use/tools/service.py`)

The standard web action verbs defined by Browser-Use:

| Action Verb | Purpose | Pre-Condition / Post-Condition |
| :--- | :--- | :--- |
| `navigate(url)` | Load target page | Page-changing; clears prior selector map |
| `click(index)` | Click interactive element | May navigate or reveal child dropdowns |
| `input_text(index, text)` | Type into input field | Chainable; often triggers `*[index]` suggestions |
| `select_dropdown_option` | Select option by value/index | Focuses parent `<select>` or combobox |
| `scroll(direction, amount)` | Scroll viewport or container | Reveals below-the-fold interactive elements |
| `search_page(pattern)` | In-page DOM text walker | Fast, zero-shot verification without scrolling |
| `save_as_pdf` | Print page to PDF | Generates downloadable document artifact |
| `done(success, text)` | Conclude task | Requires passing `<pre_done_verification>` |

---

## 3. Subagent & Journal Patterns from Goose (`aaif-goose/goose`)

Goose provides the multi-turn context isolation pattern needed when a browser task requires hundreds of exploratory actions:
1. **Bounded Turn Limits (`max_turns`):** Browser exploration subagents must be strictly bounded (e.g. 15–25 turns) to prevent infinite loops and budget exhaustion.
2. **Context Compression (Journaling):** Rather than returning 50 MB of raw accessibility snapshots and screenshots to the primary user conversation, the browser operator summarizes its navigation findings and transmits only the final structured result or artifact.
3. **Single-Level Delegation:** Subagents cannot spawn recursive subagents; they focus purely on executing the assigned browser workflow.

---

## 4. Reimplementation in TypeScript & LibreChat

### 4.1 Playwright MCP Mapping

In LibreChat, we connect directly to `@playwright/mcp`, which implements the browser primitives natively:

| Browser-Use Concept | Playwright MCP Tool |
| :--- | :--- |
| `navigate(url)` | `browser_navigate({ url })` |
| `click(index)` | `browser_click({ ref })` or `browser_mouse_click_xy({ x, y })` |
| `input_text(index, text)` | `browser_type({ ref, text })` or `browser_fill_form({ fields })` |
| `select_dropdown_option` | `browser_select_option({ ref, values })` |
| `scroll(direction)` | `browser_mouse_wheel({ deltaY })` |
| `search_page(pattern)` | `browser_find({ query })` |
| `save_as_pdf()` | `browser_pdf_save()` |
| `screenshot` | `browser_take_screenshot()` |
| `DOM state` | `browser_snapshot()` (returns accessibility tree with refs) |

### 4.2 Human-in-the-Loop (HITL) Gate

For sensitive operations:
- Any action with permanent consequences (e.g. financial transactions, account deletions, form submissions labeled "Confirm Purchase" or "Place Order") must be intercepted.
- LibreChat's MCP tool approval flow provides native confirmation dialogs before executing sensitive tool calls.
- The browser operator prompt explicitly mandates stopping and asking for confirmation when encountering payment or auth barriers.
