# UI-TARS Architecture & Grounding Extraction

> **Upstream Source:** [ByteDance UI-TARS](https://github.com/bytedance/ui-tars)  
> **Original License:** Apache License 2.0 (Copyright (c) 2025 Bytedance Ltd. and/or its affiliates)  
> **Extraction Target:** LibreChat Browser Operator Skill & MCP Grounding Pipeline

---

## 1. Executive Summary & Core Philosophy

UI-TARS is ByteDance's state-of-the-art vision-language GUI agent. Its key breakthroughs for computer use are:
1. **Separation of Cognitive Reflection and Physical Execution:** Rather than jumping directly to an action, the agent always follows:
   ```text
   Reflection: <did the last action succeed? what changed on screen?>
   Action_Summary: <what is our immediate goal, what element is targeted?>
   Action: <executable function call>
   ```
2. **Normalized Multimodal Coordinate Grounding:** Elements are grounded either by `<point>x y</point>` or bounding boxes `<bbox>x1 y1 x2 y2</bbox>`.
3. **Smart Aspect-Preserving Image Scaling (`smart_resize`):** Vision encoders require token-grid aligned dimensions (divisible by factor 28). UI-TARS scales images without distorting aspect ratios while keeping pixels within defined min/max token budgets.
4. **Safety & Refusal Logic:** When targets are missing or unexpected blockers arise (login barriers, captchas), UI-TARS treats missing visual confirmation as action failure, triggering fallback plans rather than blind execution.

---

## 2. Key Code Extractions

### 2.1 Prompt Template & Action Space (`codes/ui_tars/prompt.py`)

UI-TARS defines a standardized GUI action space in `COMPUTER_USE_DOUBAO`:

```python
# Source: codes/ui_tars/prompt.py (Apache-2.0, ByteDance Ltd.)
COMPUTER_USE_DOUBAO = """You are a GUI agent. You are given a task and your action history, with screenshots. You need to perform the next action to complete the task.

## Output Format
```
Thought: ...
Action: ...
```

## Action Space

click(point='<point>x1 y1</point>')
left_double(point='<point>x1 y1</point>')
right_single(point='<point>x1 y1</point>')
drag(start_point='<point>x1 y1</point>', end_point='<point>x2 y2</point>')
hotkey(key='ctrl c') # Split keys with a space and use lowercase. Also, do not use more than 3 keys in one hotkey action.
type(content='xxx') # Use escape characters \', \", and \n in content part to ensure we can parse the content in normal python string format. If you want to submit your input, use \n at the end of content. 
scroll(point='<point>x1 y1</point>', direction='down or up or right or left') # Show more information on the `direction` side.
wait() #Sleep for 5s and take a screenshot to check for any changes.
finished(content='xxx') # Use escape characters \', \", and \n in content part to ensure we can parse the content in normal python string format.

## Note
- Use {language} in `Thought` part.
- Write a small plan and finally summarize your next action (with its target element) in one sentence in `Thought` part.

## User Instruction
{instruction}
"""
```

### 2.2 AST Action Parsing & Coordinate Transformation (`codes/ui_tars/action_parser.py`)

UI-TARS parses function calls via Python's AST module, extracting function names and kwargs defensively:

```python
# Source: codes/ui_tars/action_parser.py (Apache-2.0, ByteDance Ltd.)
def parse_action(action_str):
    try:
        node = ast.parse(action_str, mode='eval')
        if not isinstance(node, ast.Expression):
            raise ValueError("Not an expression")
        call = node.body
        if not isinstance(call, ast.Call):
            raise ValueError("Not a function call")
        func_name = call.func.id if isinstance(call.func, ast.Name) else call.func.attr
        kwargs = {}
        for kw in call.keywords:
            key = kw.arg
            value = kw.value.value if isinstance(kw.value, ast.Constant) else None
            kwargs[key] = value
        return {'function': func_name, 'args': kwargs}
    except Exception as e:
        print(f"Failed to parse action '{action_str}': {e}")
        return None
```

Coordinate extraction and normalization from `<point>x y</point>` tags:

```python
# Source: codes/ui_tars/action_parser.py (Apache-2.0, ByteDance Ltd.)
def convert_point_to_coordinates(text, is_answer=False):
    pattern = r"<point>(\d+)\s+(\d+)</point>"

    def replace_match(match):
        x1, y1 = map(int, match.groups())
        x = (x1 + x1) // 2
        y = (y1 + y1) // 2
        return f"({x},{y})"

    text = re.sub(r"\[EOS\]", "", text)
    return re.sub(pattern, replace_match, text).strip()
```

### 2.3 Smart Aspect-Ratio Preserving Resize (`smart_resize`)

```python
# Source: codes/ui_tars/action_parser.py (Apache-2.0, ByteDance Ltd.)
def smart_resize(height: int,
                 width: int,
                 factor: int = IMAGE_FACTOR, # 28
                 min_pixels: int = MIN_PIXELS, # 100 * 28 * 28
                 max_pixels: int = MAX_PIXELS) -> tuple[int, int]:
    """
    Rescales image so dimensions are divisible by factor (28),
    total pixels in [min_pixels, max_pixels], preserving aspect ratio.
    """
    if max(height, width) / min(height, width) > MAX_RATIO:
        raise ValueError(f"aspect ratio must be smaller than {MAX_RATIO}")
    h_bar = max(factor, round_by_factor(height, factor))
    w_bar = max(factor, round_by_factor(width, factor))
    if h_bar * w_bar > max_pixels:
        beta = math.sqrt((height * width) / max_pixels)
        h_bar = floor_by_factor(height / beta, factor)
        w_bar = floor_by_factor(width / beta, factor)
    elif h_bar * w_bar < min_pixels:
        beta = math.sqrt(min_pixels / (height * width))
        h_bar = ceil_by_factor(height * beta, factor)
        w_bar = ceil_by_factor(width * beta, factor)
    return h_bar, w_bar
```

---

## 3. Reimplementation Strategy in TypeScript & LibreChat

### 3.1 Dual Grounding: Accessibility Tree + Visual Coordinates

While UI-TARS is purely vision-based (relying on model coordinate outputs), `@playwright/mcp` provides both:
1. **Accessibility Snapshot Tree (`browser_snapshot`):** Produces indexed element references (`ref=e12`, `[button "Submit"]`). This is fast, deterministic, token-efficient, and does not suffer from coordinate jitter.
2. **Visual Viewport Coordinates (`browser_mouse_click_xy`, bounding boxes):** Available when complex canvas elements, SVGs, or custom web components lack accessible roles.

### 3.2 TS Action & Coordinate Parser

In LibreChat, models communicating via OpenRouter might output:
- Standard MCP tool calls (`browser_click({ ref: "e12" })`), OR
- UI-TARS text actions (`click(point='<point>150 320</point>')` or `click(start_box='(150,320)')`).

We implement a TypeScript parser (`browser-action-parser.ts`) that:
- Detects and parses UI-TARS formatted points: `<point>x y</point>` or `(x, y)`.
- Normalizes coordinates against viewport width/height (default 1280x720).
- Maps UI-TARS action signatures (`click`, `type`, `scroll`, `wait`, `finished`) directly to Playwright MCP equivalents (`browser_mouse_click_xy`, `browser_type`, `browser_mouse_wheel`, `browser_wait_for`).

### 3.3 The Reflection-Plan-Action Loop

In our `skill/browser-operator/SKILL.md`:
1. Every browser turn requires an explicit `Reflection` section evaluating the snapshot/screenshot before issuing the next command.
2. Single-sentence action summary identifying target element before dispatch.
3. Pre-completion verification ensuring all required data was gathered before calling `browser_close` or returning final answer.
