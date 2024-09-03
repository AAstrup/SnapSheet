import { SelectedCells } from "./SelectedCells";

export interface Spreadsheet {
    cells: Cell[][]; // First array is column, second is row
    selectedCells: SelectedCells;
    mode: TextMode | MarkMode;
    viewPort: ViewPort;
}

export interface ViewPort {
    viewPortTopLeftShownCell: CellPosition;
    rowsInScreen: number;
    columnInScreen: number;
}

export interface Cell {
    formula: string;
    cachedFormulaValue: string | number,
    cachedDependencies: CellPosition[],
    cachedFormulaReferencedCells: CellPosition[]
}

export interface CellPosition {
    column: number;
    row: number;
}

export interface TextMode {
    textMode: boolean;
    cursorPosition: number;
    cursorSelectionStartPosition: number;
}

export interface MarkMode {
    markMode: boolean;
    selectCellPosition: CellPosition | undefined;
    selectCellStartPosition: CellPosition | undefined;
}
