import { createStore } from "solid-js/store";
import { Cell, CellPosition, MarkMode, Spreadsheet, TextMode } from "./Types";
import { EvaluateFormula } from "../Evaluations/Evaluator";

export const [state, setState] = createStore({
    cells: [
        [{ formula: "1", cachedFormulaValue: "1", cachedDependencies: [] },{ formula: "2", cachedFormulaValue: "2", cachedDependencies: [] }],
      ] as Cell[][],
    mode: { markMode: true } as MarkMode,
    selectedCells: []
} as Spreadsheet);

export function selectCell(row: number, col: number): void {
    setState("selectedCells", [{ row, column: col }]);
    const initialCursorPosition = 0;
    setState({ 
        ...state, 
        mode: { 
            textMode: true, 
            cursorPosition: initialCursorPosition, 
            cursorSelectionStartPosition: initialCursorPosition 
        } as TextMode 
    });
}

export function deselectCell(): void {
    setState({ ...state, mode: { markMode: true } as MarkMode});
}

export function UpdateCellFormula(row: number, col: number, formula: string): void {
    if (state.cells[row] && state.cells[row][col]) {
        let cachedFormulaValue: string | number;
        if (formula.startsWith('=')) {
            const evaluationResult = EvaluateFormula(formula.slice(1), state.cells); // Slice to remove '='
            cachedFormulaValue = evaluationResult.cachedFormulaValue;
            UpdateCellDependencies(row, col, evaluationResult.dependentCells);
        } else {
            cachedFormulaValue = formula; // Treat as plain text
        }
        setState("cells", row, col, { formula, cachedFormulaValue, cachedDependencies: state.cells[row][col].cachedDependencies } as Cell);
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