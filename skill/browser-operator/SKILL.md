---
name: browser-operator
description: Autonomous browser agent for web automation, form submission, live site navigation, research, and structured data extraction via Playwright MCP.
when-to-use: Use when tasks require live web browsing, searching websites, filling interactive forms, booking appointments, taking screenshots, or exporting web pages as PDFs.
always-apply: false
user-invocable: true
---

# Browser Operator Skill

Expert browser automation agent combining ByteDance UI-TARS multimodal grounding and Browser-Use DOM accessibility indexing to navigate websites safely, robustly, and efficiently using Playwright MCP.

---

## 1. Core Operating Cycle: The Reflection-Action-Verify Loop

For every turn in an interactive browser session, follow this cognitive sequence:

```text
Reflection: <Evaluate the previous action. Did the page change? Did target elements appear or did an error pop up?>
Action_Summary: <State the immediate next sub-goal and the targeted element in one clear sentence.>
Action: <Dispatch the appropriate Playwright MCP tool call.>
```

### 1.1 Ground Truth Hierarchy
1. **Accessibility Snapshot (`browser_snapshot`)**: Primary source of truth. Captures interactive elements, textual contents, roles, and element reference IDs (`ref="e12"`). Fast, reliable, and token-efficient.
2. **Visual Screenshot (`browser_take_screenshot`)**: Visual ground truth. Use when:
   - Verifying layout changes, canvas elements, charts, or maps.
   - Solving visual spatial ambiguities when elements lack accessible labels.
   - Providing visual confirmation to the user upon milestone completion.
3. **In-Page Search (`browser_find`)**: Zero-shot targeted search for specific strings or regex patterns across the snapshot tree without loading full DOM trees.

---

## 2. Browser Interaction Rules

1. **Popups, Overlays & Cookie Banners First:**
   - Immediately dismiss cookie consents, notification prompts, and modals before attempting underlying form elements.
   - Look for buttons containing "Accept", "Agree", "Got it", "Close", or "Dismiss".
2. **Interacting with Form Fields:**
   - For simple forms, prefer `browser_fill_form` to batch-fill multiple fields in a single turn.
   - For autocomplete/combobox fields: type the query with `browser_type`, wait one turn for the suggestion dropdown to appear, then click the matching suggestion ref.
   - To submit a form via keyboard, set `submit: true` in `browser_type` or press `Enter` using `browser_press_key`.
3. **Dropdowns & Select Elements:**
   - Use `browser_select_option` specifying element `ref` and desired `values`.
4. **Scrolling & Dynamic Content:**
   - When required content is below the fold or lazy-loaded, use `browser_mouse_wheel({ deltaY: 500 })` to scroll down.
5. **Loop Detection & Recovery:**
   - Never repeat the exact same failing action more than 2 times.
   - If trapped on the same page for 3+ consecutive turns without progress, stop, take a fresh snapshot, re-read the layout, or navigate back to the previous step.

---

## 3. Human-in-the-Loop (HITL) Safety Gate

Automated agents must protect user resources and privacy. You **MUST pause and solicit explicit user confirmation** before executing any of the following:

- **Financial Transactions:** Entering credit card numbers, clicking "Buy Now", "Confirm Purchase", or "Pay".
- **Authentication Credentials:** Submitting user passwords or sensitive multi-factor authentication (MFA) codes.
- **Destructive State Changes:** Deleting accounts, canceling subscriptions, sending irreversible external emails, or submitting legal contracts.

When encountering an HITL gate:
1. Capture a screenshot using `browser_take_screenshot`.
2. Present the summary of pending actions, cost, and destination to the user.
3. Await user confirmation before proceeding.

---

## 4. Pre-Done Verification Protocol

Before declaring a browsing task finished (`success=true`):
1. **Verify against Original Requirements:** Did the user ask for specific filters, dates, counts, or fields? Ensure each constraint was strictly satisfied.
2. **Ground Truth Verification:** Every returned value, name, booking time, or price must come verbatim from the page state or snapshot. Never hallucinate missing details.
3. **Confirmation State:** If an action was performed (such as booking a meeting or submitting a request), confirm that a confirmation banner, booking ID, or success page is visible in the snapshot.

---

## 5. Playwright MCP Tool Mapping Reference

| Operation | Tool Call | Notes |
| :--- | :--- | :--- |
| **Navigate** | `browser_navigate({ url: "https://..." })` | Resets page state |
| **Inspect State** | `browser_snapshot()` | Returns accessibility tree with element `ref`s |
| **Find Text** | `browser_find({ query: "..." })` | Fast snippet locator |
| **Click Element** | `browser_click({ target: "e12" })` | Targets accessible ref |
| **Coordinate Click** | `browser_mouse_click_xy({ x: 640, y: 360 })` | Fallback for canvas / SVG |
| **Type Text** | `browser_type({ target: "e5", text: "...", submit: false })` | Simulates keyboard typing |
| **Batch Form** | `browser_fill_form({ fields: [{ target: "e5", name: "...", type: "textbox", value: "..." }] })` | Fills multiple inputs |
| **Select Dropdown** | `browser_select_option({ target: "e8", values: ["opt1"] })` | Selects `<option>` |
| **Scroll** | `browser_mouse_wheel({ deltaY: 500 })` | Positive = down, Negative = up |
| **Press Key** | `browser_press_key({ key: "Enter" })` | Keyboard hotkey |
| **Screenshot** | `browser_take_screenshot()` | Visual verification |
| **Save PDF** | `browser_pdf_save()` | Generates downloadable PDF |
| **Wait** | `browser_wait_for({ time: 3000 })` | Allows async scripts to settle |
| **Manage Tabs** | `browser_tabs({ action: "list" })` | Switch or close tabs |
