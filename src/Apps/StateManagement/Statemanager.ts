import { createStore } from "solid-js/store";
import { Cell, CellPosition, MarkMode, Spreadsheet, TextMode } from "./Types";
import { EvaluateFormula } from "../Evaluations/Evaluator";
import { getViewportSize } from "../Renders/ViewPort";

export const [state, setState] = createStore({
    cells: getCells(),
    mode: { markMode: true } as MarkMode,
    selectedCells: [],
    viewPort: {
        viewPortTopLeftShownCell: { row:0, column:0 },
        rowsInScreen: getViewportSize().rowsInScreen,
        columnInScreen: getViewportSize().columnInScreen,
    }
} as Spreadsheet);

export function selectCell(row: number, col: number): void {
    if('textMode' in state.mode)
    {
        state.selectedCells.forEach(selectedCell => {
            EvaluateCellFormula(selectedCell.row,selectedCell.column);
        });
    }
    else if('markMode' in state.mode)
    {
        setState("mode", { 
            selectCellPosition: { row, column: col }
        } as MarkMode);
    }
    updateViewPort(row, col);
    setState("selectedCells", [{ row, column: col }]);
    console.log("selectCell", state.selectedCells[0], row, col, state.selectedCells.length)
}

export function updateViewPort(row: number, col: number): void {
    const view = state.viewPort;
    const newViewPortTopLeftShownCell = {...view.viewPortTopLeftShownCell}; 
    const rowsBeforeView = view.viewPortTopLeftShownCell.row - row;
    const colBeforeView = view.viewPortTopLeftShownCell.column - col;
    const rowsAfterView = row + 1 - (view.viewPortTopLeftShownCell.row + view.rowsInScreen);
    const colAfterView = col + 1 - (view.viewPortTopLeftShownCell.column + view.columnInScreen);
    if(rowsBeforeView > 0)
    {
        newViewPortTopLeftShownCell.row -= rowsBeforeView;
    }
    else if(rowsAfterView > 0 )
    {
        newViewPortTopLeftShownCell.row += rowsAfterView
    }

    
    if(colBeforeView > 0)
    {
        newViewPortTopLeftShownCell.column -= colBeforeView;
    }
    else if(colAfterView > 0 )
    {
        newViewPortTopLeftShownCell.column += colAfterView;
    }
    
    if(newViewPortTopLeftShownCell.column != view.viewPortTopLeftShownCell.column || newViewPortTopLeftShownCell.row != view.viewPortTopLeftShownCell.row) {
        setState("viewPort", {
            viewPortTopLeftShownCell: newViewPortTopLeftShownCell
        });
    }
}

export function deselectCell(): void {
    EvaluateSelectedFormulas();
    setState({ ...state, mode: { markMode: true } as MarkMode});
}

function EvaluateSelectedFormulas() {
    state.selectedCells.forEach(selectedCell => {
        EvaluateCellFormula(selectedCell.row, selectedCell.column);
    });
}

export function UpdateCellFormulaNoEvaluate(row: number, col: number, formula: string): void {
    if (state.cells[row] && state.cells[row][col]) {
        setState("cells", row, col, { formula } as Cell);
    } else {
        console.error("Invalid row or column index");
    }
}

export function UpdateCellFormulaAndEvaluate(row: number, col: number, formula: string): void {
    UpdateCellFormulaNoEvaluate(row, col, formula);
    EvaluateSelectedFormulas();
}

function EvaluateCellFormula(row: number, col: number): void {
    if (state.cells[row] && state.cells[row][col]) {
        let formula = state.cells[row][col].formula;
        let cachedFormulaValue: string | number;
        let cachedFormulaReferencedCells : CellPosition[] = [];
        if (formula.startsWith('=')) {
            const evaluationResult = EvaluateFormula(formula, state.cells); // Slice to remove '='
            cachedFormulaValue = evaluationResult.cachedFormulaValue;
            cachedFormulaReferencedCells = evaluationResult.formulaReferencedCells;
            UpdateCellDependencies(row, col, evaluationResult.formulaReferencedCells);
        } else {
            cachedFormulaValue = formula; // Treat as plain text
        }
        setState("cells", row, col, { cachedFormulaValue, cachedDependencies: state.cells[row][col].cachedDependencies, cachedFormulaReferencedCells } as Cell);

        state.cells[row][col].cachedDependencies.forEach(dependency => {
            EvaluateCellFormula(dependency.row, dependency.column);
        });
    } else {
        console.error("Invalid row or column index");
    }
}

export function UpdateCellDependencies(row: number, col: number, dependencies: CellPosition[]): void {
    dependencies.forEach(dep => {
        const dependentCell = state.cells[dep.row][dep.column];
        
        if (!dependentCell.cachedDependencies) {
            dependentCell.cachedDependencies = [];
        }
        
        const isAlreadyDependent = dependentCell.cachedDependencies.some(dep => dep.row === row && dep.column === col);
        
        if (!isAlreadyDependent) {
            setState("cells", dep.row, dep.column, "cachedDependencies", deps => [...deps, { row, column: col }]);
        }
    });
}

function createCell(initValue: string): Cell {
    return { formula: initValue, cachedFormulaValue: initValue, cachedDependencies: [], cachedFormulaReferencedCells: [] };
}

export function addColumn(): void { 
    setState("cells", cells =>
        cells.map(row => [...row, createCell("")]) // Add a new cell to each row
    );
}

export function addRow(): void {
    const newRow = state.cells[0].map(() => createCell("")); // Create a new row with empty cells
    setState("cells", cells => [...cells, newRow]); // Append the new row to the cells
}

function getCells(): Cell[][] {
    let cells : Cell[][] = [];
    
    for (let rowIndex = 0; rowIndex < 100; rowIndex++) {
        const row = [];
        for (let colIndex = 0; colIndex < 100; colIndex++) {
            row.push(createCell(""));
        }
        cells.push(row);
    }

    return cells;
}
