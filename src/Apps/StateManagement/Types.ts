export interface Spreadsheet {
    cells: Cell[][]; // First array is column, second is row
    selectedCells: CellPosition[];
    mode: TextMode | MarkMode;
}

export interface Cell {
    formula: string;
    cachedFormulaValue: string | number,
    cachedDependencies: CellPosition[],
}

export interface CellPosition {
    column: number;
    row: number;
}

export interface TextMode {
    textMode: boolean;
    cursorPosition: number;
}

export interface MarkMode {
    markMode: boolean;
}
