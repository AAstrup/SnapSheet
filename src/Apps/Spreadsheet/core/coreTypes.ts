import { getCellReferenceRowColumn } from "./formulaCore/TokenEvaluator";
import { Token } from "./formulaCore/TokenTypes";

export type CellPosition = { row: number, col: number }

export type Cell = {
  formulaCachedValue: string;
  formula: string;
  cellsDependingOnCell: CellPosition[];  // List of cells referencing this cell
};

export type Row = Cell[];

export type Spreadsheet = Row[];

export function getNewSheet(data: Spreadsheet): Spreadsheet {
  return data.map(row => 
    row.map(cell => ({ ...cell }))
);
}

export function cellWithinBounds(spreadsheet: Spreadsheet, rowIndex: number, colIndex: number): boolean {
  return spreadsheet.length > rowIndex && spreadsheet[rowIndex].length > colIndex;
}

export function getCell(spreadsheet: Spreadsheet, rowIndex: number, colIndex: number): Cell {
  return spreadsheet[rowIndex][colIndex];
}

export function getCellFromToken(spreadsheet: Spreadsheet, token: Token): Cell {
  const cell = getCellReferenceRowColumn(token);
  return spreadsheet[cell.row][cell.col];
}

export function updateCell(spreadsheet: Spreadsheet, rowIndex: number, colIndex: number, cell: Cell): void {
  spreadsheet[rowIndex][colIndex] = cell;
}
