export interface Spreadsheet {
    cells: Cell[][]; // First array is column, second is row
}

export interface Cell {
    formula: string;
    cachedFormulaValue: string | number,
    cachedDependencies: CellPosition[] | undefined,
}

export interface CellPosition {
    column: number,
    row: number,
}



