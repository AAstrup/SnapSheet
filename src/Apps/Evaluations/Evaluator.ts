// Evaluator.ts
import { Cell, CellPosition } from "../StateManagement/Types";
import { Tokenizer, Token } from "./Tokenizer";

export interface EvaluateResult {
    cachedFormulaValue : string | number,
    formulaReferencedCells : CellPosition[]
}

export const EvaluateFormula = (formula: string, cells: Cell[][]): EvaluateResult => {
    const tokens = Tokenizer.tokenize(formula);
    const { cachedFormulaValue, dependentCells } = evaluateTokens(formula, tokens, cells);

    return { cachedFormulaValue, formulaReferencedCells: dependentCells};
};

const evaluateTokens = (formula: string, tokens: Token[], cells: Cell[][]): { cachedFormulaValue: string | number, dependentCells: CellPosition[] } => {
    let expression = '';
    const dependentCells: CellPosition[] = [];

    tokens.forEach(token => {
        if (token.type === 'IDENTIFIER') {
            // Extract row and column from the identifier (e.g., A1 -> row 0, col 0)
            const { row, column } = parseCellIdentifier(token.value);
            const cellValue = getCellValueFromIdentifier(token.value, cells);

            // Add the cell position to the dependentCells array
            dependentCells.push({ row, column });

            expression += cellValue;
        } else if (token.type === 'NUMBER' || token.type === 'OPERATOR') {
            expression += token.value;
        } else {
            return token.value;
            // throw new Error(`Unknown token type: ${token.type}`);
        }
    });

    try {
        const cachedFormulaValue = eval(expression); // Evaluate the expression safely
        return { cachedFormulaValue, dependentCells };
    } catch (error) {
        console.error(`Failed to evaluate expression: ${expression}`, error);
        return { cachedFormulaValue: `${formula}`, dependentCells }; // Return an error indicator if evaluation fails
    }
};


const getCellValueFromIdentifier = (identifier: string, cells: Cell[][]): string | number => {
    const { row, column } = parseCellIdentifier(identifier);
    const cell = cells[row] && cells[row][column];

    if (cell && typeof cell.cachedFormulaValue === 'string' || typeof cell.cachedFormulaValue === 'number') {
        return cell.cachedFormulaValue;
    }

    return `#ERROR`; // Return an error indicator if the cell is not found or value is invalid
};

const parseCellIdentifier = (identifier: string): { row: number, column: number } => {
    const column = identifier.charCodeAt(0) - 'A'.charCodeAt(0); // Convert 'A' -> 0, 'B' -> 1, etc.
    const row = parseInt(identifier.slice(1), 10) - 1; // Convert '1' -> 0, '2' -> 1, etc.

    return { row, column };
};
