/**
 * Action Parser and Coordinate Grounding for Browser Operator
 *
 * Adapted from ByteDance UI-TARS (Apache-2.0) and Browser-Use (MIT)
 * Licenses:
 * - UI-TARS: Copyright (c) 2025 Bytedance Ltd. and/or its affiliates (Apache-2.0)
 * - Browser-Use: Copyright (c) 2024 Gregor Zunic (MIT)
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface ParsedUITarsAction {
  function: string;
  args: Record<string, unknown>;
  raw: string;
}

export interface MRPThoughtStructure {
  reflection?: string;
  actionSummary?: string;
  action?: string;
  rawThought?: string;
}

export interface PlaywrightActionMapping {
  tool: string;
  parameters: Record<string, unknown>;
  description: string;
}

export interface IndexedElement {
  index: number;
  isNew: boolean;
  tagName: string;
  attributes: Record<string, string>;
  text?: string;
  isScrollable: boolean;
  inShadowDom: boolean;
}

// Factor for vision token grid alignment (divisible by 28, standard for ViT / Qwen-VL)
export const IMAGE_FACTOR = 28;
export const MIN_PIXELS = 100 * 28 * 28;
export const MAX_PIXELS = 16384 * 28 * 28;
export const MAX_RATIO = 200;

export const DEFAULT_VIEWPORT: Dimensions = {
  width: 1280,
  height: 720,
};

/**
 * Rounds number to nearest multiple of factor.
 */
export function roundByFactor(number: number, factor: number): number {
  return Math.round(number / factor) * factor;
}

/**
 * Rounds number up to nearest multiple of factor.
 */
export function ceilByFactor(number: number, factor: number): number {
  return Math.ceil(number / factor) * factor;
}

/**
 * Rounds number down to nearest multiple of factor.
 */
export function floorByFactor(number: number, factor: number): number {
  return Math.floor(number / factor) * factor;
}

/**
 * Rescales image dimensions so that:
 * 1. Both dimensions are divisible by factor (default 28).
 * 2. Total pixels stay within [minPixels, maxPixels].
 * 3. Aspect ratio is preserved.
 *
 * Direct TS port of UI-TARS smart_resize (Apache-2.0).
 */
export function smartResize(options: {
  width: number;
  height: number;
  factor?: number;
  minPixels?: number;
  maxPixels?: number;
}): Dimensions {
  const {
    width,
    height,
    factor = IMAGE_FACTOR,
    minPixels = MIN_PIXELS,
    maxPixels = MAX_PIXELS,
  } = options;

  if (Math.max(height, width) / Math.min(height, width) > MAX_RATIO) {
    throw new Error(
      `Aspect ratio must be smaller than ${MAX_RATIO}, got ${Math.max(height, width) / Math.min(height, width)}`,
    );
  }

  let hBar = Math.max(factor, roundByFactor(height, factor));
  let wBar = Math.max(factor, roundByFactor(width, factor));

  if (hBar * wBar > maxPixels) {
    const beta = Math.sqrt((height * width) / maxPixels);
    hBar = floorByFactor(height / beta, factor);
    wBar = floorByFactor(width / beta, factor);
  } else if (hBar * wBar < minPixels) {
    const beta = Math.sqrt(minPixels / (height * width));
    hBar = ceilByFactor(height * beta, factor);
    wBar = ceilByFactor(width * beta, factor);
  }

  return { width: wBar, height: hBar };
}

/**
 * Extracts point coordinates from XML `<point>x y</point>` or tuple `(x, y)` strings.
 */
export function extractPointCoordinates(text: string): Point2D | null {
  if (!text) {
    return null;
  }

  // Check <point>x y</point> format
  const pointTagMatch = text.match(/<point>\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*<\/point>/i);
  if (pointTagMatch) {
    return {
      x: parseFloat(pointTagMatch[1]),
      y: parseFloat(pointTagMatch[2]),
    };
  }

  // Check (x, y) or [x, y] or (x y) format
  const tupleMatch = text.match(/[([{\s]*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[)\]}\s]*/);
  if (tupleMatch) {
    return {
      x: parseFloat(tupleMatch[1]),
      y: parseFloat(tupleMatch[2]),
    };
  }

  return null;
}

/**
 * Extracts bounding box coordinates `<bbox>x1 y1 x2 y2</bbox>` or `[x1, y1, x2, y2]`.
 */
export function extractBoxCoordinates(text: string): BoundingBox | null {
  if (!text) {
    return null;
  }

  const boxTagMatch = text.match(
    /<(?:box|bbox)>\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*<\/(?:box|bbox)>/i,
  );
  if (boxTagMatch) {
    return {
      x1: parseFloat(boxTagMatch[1]),
      y1: parseFloat(boxTagMatch[2]),
      x2: parseFloat(boxTagMatch[3]),
      y2: parseFloat(boxTagMatch[4]),
    };
  }

  const tupleMatch = text.match(
    /[([{\s]*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[)\]}\s]*/,
  );
  if (tupleMatch) {
    return {
      x1: parseFloat(tupleMatch[1]),
      y1: parseFloat(tupleMatch[2]),
      x2: parseFloat(tupleMatch[3]),
      y2: parseFloat(tupleMatch[4]),
    };
  }

  return null;
}

/**
 * Scales a 2D coordinate point from model source dimensions (or normalized 0..1000)
 * to target browser viewport coordinates.
 */
export function scaleCoordinatesToViewport(
  point: Point2D,
  sourceDimensions: Dimensions,
  targetViewport: Dimensions = DEFAULT_VIEWPORT,
): Point2D {
  // If coordinates are normalized in 0..1000 scale (typical UI-TARS Doubao output)
  if (sourceDimensions.width === 1000 && sourceDimensions.height === 1000) {
    return {
      x: Math.round((point.x / 1000) * targetViewport.width),
      y: Math.round((point.y / 1000) * targetViewport.height),
    };
  }

  // If coordinates are in normalized 0..1 float scale
  if (sourceDimensions.width === 1 && sourceDimensions.height === 1) {
    return {
      x: Math.round(point.x * targetViewport.width),
      y: Math.round(point.y * targetViewport.height),
    };
  }

  // Direct aspect scaling
  return {
    x: Math.round((point.x / sourceDimensions.width) * targetViewport.width),
    y: Math.round((point.y / sourceDimensions.height) * targetViewport.height),
  };
}

/**
 * Parses Multi-turn Reasoning & Planning (MRP) blocks.
 * Supports:
 * - `Reflection: ... Action_Summary: ... Action: ...`
 * - `Thought: ... Action: ...`
 */
export function parseMRPLoop(text: string): MRPThoughtStructure {
  if (!text) {
    return {};
  }

  const result: MRPThoughtStructure = {};

  // Check for Reflection / Action_Summary format
  const reflectionMatch = text.match(/Reflection:\s*([\s\S]+?)(?=(?:Action_Summary:|Action:|$))/i);
  if (reflectionMatch) {
    result.reflection = reflectionMatch[1].trim();
  }

  const summaryMatch = text.match(/Action_Summary:\s*([\s\S]+?)(?=(?:Action:|$))/i);
  if (summaryMatch) {
    result.actionSummary = summaryMatch[1].trim();
  }

  // Check for Thought: ...
  const thoughtMatch = text.match(/Thought:\s*([\s\S]+?)(?=(?:Action:|$))/i);
  if (thoughtMatch && !result.reflection) {
    result.rawThought = thoughtMatch[1].trim();
  }

  // Check for Action: ...
  const actionMatch = text.match(/Action:\s*([\s\S]+)$/i);
  if (actionMatch) {
    result.action = actionMatch[1].trim();
  }

  return result;
}

/**
 * Parses a single UI-TARS action string, e.g.:
 * `click(point='<point>150 200</point>')`
 * `type(content='hello world\n')`
 * `scroll(point='<point>500 500</point>', direction='down')`
 */
export function parseUITarsAction(actionStr: string): ParsedUITarsAction | null {
  if (!actionStr || typeof actionStr !== 'string') {
    return null;
  }

  const trimmed = actionStr.trim();
  // Match func_name(...)
  const match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([\s\S]*)\)$/);
  if (!match) {
    return null;
  }

  const funcName = match[1];
  const paramsRaw = match[2].trim();
  const args: Record<string, unknown> = {};

  if (paramsRaw) {
    // Regex to extract key='value' or key="value" or key=value
    const paramRegex =
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|([^,]+))/g;
    let paramMatch: RegExpExecArray | null;
    while ((paramMatch = paramRegex.exec(paramsRaw)) !== null) {
      const key = paramMatch[1];
      const singleQuoteVal = paramMatch[2];
      const doubleQuoteVal = paramMatch[3];
      const rawVal = paramMatch[4];

      let value = singleQuoteVal ?? doubleQuoteVal ?? rawVal?.trim();
      if (value !== undefined) {
        // Unescape standard escapes
        value = value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
        args[key] = value;
      }
    }
  }

  return {
    function: funcName,
    args,
    raw: trimmed,
  };
}

/**
 * Converts a parsed UI-TARS action into Playwright MCP compatible tool call parameters.
 */
export function convertUITarsActionToPlaywright(
  action: ParsedUITarsAction,
  sourceDimensions: Dimensions = { width: 1000, height: 1000 },
  viewport: Dimensions = DEFAULT_VIEWPORT,
): PlaywrightActionMapping {
  const { function: funcName, args } = action;

  switch (funcName) {
    case 'click':
    case 'left_double':
    case 'right_single': {
      const pointStr =
        (args.point as string) || (args.start_point as string) || (args.start_box as string);
      const point = pointStr ? extractPointCoordinates(pointStr) : null;
      if (point) {
        const scaled = scaleCoordinatesToViewport(point, sourceDimensions, viewport);
        return {
          tool: 'browser_mouse_click_xy',
          parameters: {
            x: scaled.x,
            y: scaled.y,
            button: funcName === 'right_single' ? 'right' : 'left',
            clickCount: funcName === 'left_double' ? 2 : 1,
          },
          description: `Click at coordinates (${scaled.x}, ${scaled.y})`,
        };
      }
      const target = (args.target as string) || (args.ref as string) || (args.element as string);
      if (target) {
        return {
          tool: 'browser_click',
          parameters: { target },
          description: `Click element ${target}`,
        };
      }
      break;
    }

    case 'type': {
      const rawContent = (args.content ?? args.text ?? '') as string;
      const hasNewline = rawContent.endsWith('\n');
      const cleanContent = hasNewline ? rawContent.slice(0, -1) : rawContent;
      const target = (args.target as string) || (args.ref as string) || (args.element as string);

      if (target) {
        return {
          tool: 'browser_type',
          parameters: {
            target,
            text: cleanContent,
            submit: hasNewline,
          },
          description: `Type text into element ${target}`,
        };
      }
      return {
        tool: 'browser_type',
        parameters: { text: cleanContent, submit: hasNewline },
        description: `Type text "${cleanContent}"`,
      };
    }

    case 'scroll': {
      const direction = (args.direction as string) || 'down';
      let deltaY = 0;
      if (direction === 'up') {
        deltaY = -500;
      } else if (direction === 'down') {
        deltaY = 500;
      }

      let deltaX = 0;
      if (direction === 'left') {
        deltaX = -500;
      } else if (direction === 'right') {
        deltaX = 500;
      }

      return {
        tool: 'browser_mouse_wheel',
        parameters: { deltaX, deltaY },
        description: `Scroll ${direction}`,
      };
    }

    case 'hotkey': {
      const key = (args.key as string) || '';
      return {
        tool: 'browser_press_key',
        parameters: { key },
        description: `Press hotkey "${key}"`,
      };
    }

    case 'wait': {
      const rawSeconds = args.seconds as string | undefined;
      const timeMs = rawSeconds ? parseFloat(rawSeconds) * 1000 : 5000;
      return {
        tool: 'browser_wait_for',
        parameters: { time: timeMs },
        description: `Wait for ${timeMs}ms`,
      };
    }

    case 'drag': {
      const startPointStr = (args.start_point as string) || (args.start_box as string);
      const endPointStr = (args.end_point as string) || (args.end_box as string);
      const start = startPointStr ? extractPointCoordinates(startPointStr) : null;
      const end = endPointStr ? extractPointCoordinates(endPointStr) : null;

      if (start && end) {
        const scaledStart = scaleCoordinatesToViewport(start, sourceDimensions, viewport);
        const scaledEnd = scaleCoordinatesToViewport(end, sourceDimensions, viewport);
        return {
          tool: 'browser_mouse_drag_xy',
          parameters: {
            startX: scaledStart.x,
            startY: scaledStart.y,
            endX: scaledEnd.x,
            endY: scaledEnd.y,
          },
          description: `Drag mouse from (${scaledStart.x}, ${scaledStart.y}) to (${scaledEnd.x}, ${scaledEnd.y})`,
        };
      }
      break;
    }

    case 'finished': {
      const content = (args.content as string) || '';
      return {
        tool: 'done',
        parameters: { success: true, text: content },
        description: `Complete task: ${content || 'Done'}`,
      };
    }
  }

  // Fallback
  return {
    tool: funcName,
    parameters: args,
    description: `Custom action ${funcName}`,
  };
}

/**
 * Parses Browser-Use serialized element tree lines, e.g.:
 * `*[12]<button type=submit aria-label="Submit Form" />`
 * `[5]<input type=text placeholder="Search" />`
 */
export function parseIndexedElementTree(text: string): IndexedElement[] {
  if (!text) {
    return [];
  }

  const elements: IndexedElement[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Match [*[index] or [index] followed by <tag ...>
    const match = trimmed.match(
      /(\|SHADOW\([^)]+\)\|)?(\|scroll element)?(\*?)\s*\[(\d+)\]\s*<([a-zA-Z0-9_-]+)([^>]*)\/?>/i,
    );
    if (!match) {
      continue;
    }

    const inShadowDom = Boolean(match[1]);
    const isScrollable = Boolean(match[2]);
    const isNew = match[3] === '*';
    const index = parseInt(match[4], 10);
    const tagName = match[5].toLowerCase();
    const rawAttrs = match[6] || '';

    const attributes: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const key = attrMatch[1];
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
      attributes[key] = val;
    }

    elements.push({
      index,
      isNew,
      tagName,
      attributes,
      isScrollable,
      inShadowDom,
    });
  }

  return elements;
}
