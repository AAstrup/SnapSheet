export interface Spreadsheet {
    cells: Cell[][]; // First array is column, second is row
    selectedCells: SelectedCells
    referencedCells: ReferencedCells
    mode: TextMode | MarkMode;
    viewPort: ViewPort;
}

export interface SelectedCells {
   [cellPosition: string]: boolean;  
}

export const getCellPositionKey = (row: number, column: number): string => {
    return `${row},${column}`;
}
export const getKeyCellPosition = (cellPositionKey: string): CellPosition => {
    const [row, column] = cellPositionKey.split(',').map(Number);
    return { row, column };
}

export interface ReferencedCells {
    [cellPosition: string]: boolean;  
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
