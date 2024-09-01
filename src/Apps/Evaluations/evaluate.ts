import { Cell, CellPosition } from "../StateManagement/Types";
import { evaluatorAst } from "./evaluatorAst";
import { tokenize } from "./lexicalAnalyser";
import { syntaticAnalyser } from "./syntaticAnalyser";

export type evaluationResult = {
    formulaValue: string | number | boolean,
    formulaReferencedCells: CellPosition[];
}

export const evaluate = (formula: string, cells: Cell[][]): evaluationResult => {
    var tokens = tokenize(formula);
    var ast = syntaticAnalyser(tokens);
    var formulaValue = evaluatorAst(ast, cells);
    var formulaReferencedCells = tokens.filter(t => t.type === "CellReference").map(c => c.value);
    console.log("evaluate formula", tokens, ast, formulaValue, formulaReferencedCells);
    return {formulaValue, formulaReferencedCells};
}