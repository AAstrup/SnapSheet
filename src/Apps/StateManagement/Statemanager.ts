import { createStore } from "solid-js/store";
import { Cell, CellPosition, MarkMode, Spreadsheet, TextMode } from "./Types";
import { EvaluateFormula } from "../Evaluations/Evaluator";

export const [state, setState] = createStore({
    cells: [
        [createCell("1"),createCell("2"), createCell("3")],
      ] as Cell[][],
    mode: { markMode: true } as MarkMode,
    selectedCells: []
} as Spreadsheet);

export function selectCell(row: number, col: number): void {
    state.selectedCells.forEach(selectedCell => {
        EvaluateCellFormula(selectedCell.row,selectedCell.column);
    });
    
    setState("selectedCells", [{ row, column: col }]);
    // const initialCursorPosition = 0;
    // setState({ 
    //     ...state, 
    //     mode: { 
    //         textMode: true, 
    //         cursorPosition: initialCursorPosition, 
    //         cursorSelectionStartPosition: initialCursorPosition 
    //     } as TextMode 
    // });
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
