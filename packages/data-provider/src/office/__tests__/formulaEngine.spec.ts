import {
  colLetterToIndex,
  indexToColLetter,
  parseCoordinate,
  resolveRange,
  evaluateFormula,
  formatCellValue,
} from '../formulaEngine';

describe('formulaEngine', () => {
  it('converts column letters and indices bidirectionally', () => {
    expect(colLetterToIndex('A')).toBe(0);
    expect(colLetterToIndex('B')).toBe(1);
    expect(colLetterToIndex('Z')).toBe(25);
    expect(colLetterToIndex('AA')).toBe(26);

    expect(indexToColLetter(0)).toBe('A');
    expect(indexToColLetter(1)).toBe('B');
    expect(indexToColLetter(25)).toBe('Z');
  });

  it('parses cell coordinate strings', () => {
    expect(parseCoordinate('A1')).toEqual({ row: 0, col: 0 });
    expect(parseCoordinate('B4')).toEqual({ row: 3, col: 1 });
    expect(parseCoordinate('invalid')).toBeNull();
  });

  it('evaluates SUM formula across range', () => {
    const grid = [
      ['Product A', 100],
      ['Product B', 250],
      ['Product C', 150],
    ];

    const result = evaluateFormula('=SUM(B1:B3)', grid);
    expect(result).toBe(500);
  });

  it('evaluates AVERAGE, COUNT, MAX, and MIN formulas', () => {
    const grid = [
      [10, 20],
      [30, 40],
    ];

    expect(evaluateFormula('=AVERAGE(A1:B2)', grid)).toBe(25);
    expect(evaluateFormula('=COUNT(A1:B2)', grid)).toBe(4);
    expect(evaluateFormula('=MAX(A1:B2)', grid)).toBe(40);
    expect(evaluateFormula('=MIN(A1:B2)', grid)).toBe(10);
  });

  it('evaluates cell arithmetic', () => {
    const grid = [
      [100, 50],
    ];

    expect(evaluateFormula('=A1 + B1', grid)).toBe(150);
    expect(evaluateFormula('=A1 * 1.5', grid)).toBe(150);
    expect(evaluateFormula('=A1 / B1', grid)).toBe(2);
  });

  it('formats cell values properly', () => {
    expect(formatCellValue(1500, 'currency')).toBe('$1,500');
    expect(formatCellValue(0.254, 'percent')).toBe('25.4%');
    expect(formatCellValue(1200000, 'number')).toBe('1,200,000');
    expect(formatCellValue('Test Text', 'text')).toBe('Test Text');
  });
});
