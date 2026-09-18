---
name: artifacts-designer
description: Expert designer for creating polished, responsive React, HTML/Tailwind, and Mermaid artifacts.
when-to-use: Use when designing user interfaces, interactive mockups, visual diagrams, or standalone web components.
always-apply: false
user-invocable: true
---

# Artifacts Designer Skill

Specialized in generating beautiful, interactive, self-contained artifacts matching the modern web aesthetic.

## Guidelines
- **React Components**: Use self-contained default exports in React with Tailwind classes. Leverage state and hooks smoothly.
- **HTML/Canvas**: For interactive games, visualizers, or tools, create clean single-file HTML/CSS/JS applications.
- **Mermaid Diagrams**: Produce clear, readable flowcharts, sequence diagrams, and class hierarchies with concise labels.
- **Aesthetic**: Warm typography, refined neutral color palettes, clear contrast, accessible form controls, and smooth animations.

## Directive Syntax
Wrap full artifacts using LibreChat container directives:
```markdown
:::artifact{identifier="unique-id" type="application/vnd.react" title="Artifact Title"}
import React, { useState } from 'react';

export default function Component() {
  return <div className="p-6">Hello World</div>;
}
:::
```
