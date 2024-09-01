import { Cell } from "../StateManagement/Types";
import { evaluateExpr } from "./evaluatorExpr";
import { parseExpression } from "./parseExpr";
import { CellPosition } from "./types";

export interface evaluateResult {
    cachedFormulaValue: string,
    formulaReferencedCells: CellPosition[] 
}

export function evaluateFormula(formula: string, cells: Cell[][]): evaluateResult {
    const { expr, formulaReferencedCells } = parseExpression(formula);
    const evalResult = evaluateExpr(expr, cells);
    return {
        cachedFormulaValue: evalResult.toString(),
        formulaReferencedCells: formulaReferencedCells,
    }
}
