/**
 * Converts column letter to 0-based index. e.g. 'A' -> 0, 'B' -> 1, 'Z' -> 25.
 */
export function colLetterToIndex(col: string): number {
  let index = 0;
  const upper = col.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Converts 0-based index to column letter. e.g. 0 -> 'A', 1 -> 'B', 25 -> 'Z'.
 */
export function indexToColLetter(index: number): string {
  let letter = '';
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Parses coordinate like 'B4' into { row: 3, col: 1 }.
 */
export function parseCoordinate(coord: string): { row: number; col: number } | null {
  const match = /^([A-Za-z]+)(\d+)$/.exec(coord.trim());
  if (!match) {
    return null;
  }
  const col = colLetterToIndex(match[1]);
  const row = parseInt(match[2], 10) - 1;
  return { row, col };
}

/**
 * Extracts a numeric value from a cell, stripping currency symbols, commas and percent.
 */
export function extractNumeric(val: unknown): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/[\$,%\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Resolves cell range like 'A1:A5' or 'B2:C4' into a flat array of numbers from a 2D matrix.
 */
export function resolveRange(rangeStr: string, rows: Array<Array<string | number>>): number[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) {
    const coord = parseCoordinate(parts[0]);
    if (!coord) return [];
    const val = rows[coord.row]?.[coord.col];
    return [extractNumeric(val)];
  }

  const start = parseCoordinate(parts[0]);
  const end = parseCoordinate(parts[1]);
  if (!start || !end) return [];

  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const values: number[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const val = rows[r]?.[c];
      values.push(extractNumeric(val));
    }
  }
  return values;
}

/**
 * Evaluates an Excel formula like '=SUM(A1:A5)' or '=B1+B2' against a 2D grid.
 */
export function evaluateFormula(formula: string, rows: Array<Array<string | number>>): number | string {
  if (!formula.startsWith('=')) {
    return formula;
  }

  const expr = formula.slice(1).trim().toUpperCase();

  // SUM function
  const sumMatch = /^SUM\(([^)]+)\)$/i.exec(expr);
  if (sumMatch) {
    const values = resolveRange(sumMatch[1], rows);
    return values.reduce((acc, curr) => acc + curr, 0);
  }

  // AVERAGE function
  const avgMatch = /^AVERAGE\(([^)]+)\)$/i.exec(expr);
  if (avgMatch) {
    const values = resolveRange(avgMatch[1], rows);
    if (values.length === 0) return 0;
    return values.reduce((acc, curr) => acc + curr, 0) / values.length;
  }

  // COUNT function
  const countMatch = /^COUNT\(([^)]+)\)$/i.exec(expr);
  if (countMatch) {
    const values = resolveRange(countMatch[1], rows);
    return values.length;
  }

  // MAX function
  const maxMatch = /^MAX\(([^)]+)\)$/i.exec(expr);
  if (maxMatch) {
    const values = resolveRange(maxMatch[1], rows);
    return values.length > 0 ? Math.max(...values) : 0;
  }

  // MIN function
  const minMatch = /^MIN\(([^)]+)\)$/i.exec(expr);
  if (minMatch) {
    const values = resolveRange(minMatch[1], rows);
    return values.length > 0 ? Math.min(...values) : 0;
  }

  // Basic arithmetic: e.g. "A1 + B1", "C2 * 1.25"
  try {
    const replaced = expr.replace(/[A-Z]+\d+/g, (cell) => {
      const coord = parseCoordinate(cell);
      if (!coord) return '0';
      const val = rows[coord.row]?.[coord.col];
      return String(extractNumeric(val));
    });

    // Safe mathematical evaluation (only numbers and basic math operators)
    if (/^[0-9+\-*/().\s]+$/.test(replaced)) {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${replaced})`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    }
  } catch {
    return '#ERROR!';
  }

  return formula;
}

/**
 * Formats a numeric value into a stylized string.
 */
export function formatCellValue(value: number | string, format?: 'number' | 'currency' | 'percent' | 'text'): string {
  if (typeof value === 'string') {
    return value;
  }
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (format === 'percent') {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (format === 'number') {
    return new Intl.NumberFormat('en-US').format(value);
  }
  return String(value);
}
