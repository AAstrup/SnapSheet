import { Cell, CellPosition } from "../StateManagement/Types";
import { evaluatorAst } from "./evaluatorAst";
import { tokenize } from "./tokenizer";
import { syntaticAnalyser } from "./syntaticAnalyser";

export type evaluationResult = {
    formulaValue: string | number | boolean,
    formulaReferencedCells: CellPosition[];
}

export const evaluate = (rawFormula: string, cells: Cell[][]): evaluationResult => {
    const formula = rawFormula.substring(1);
    var tokens = tokenize(formula);
    var ast = syntaticAnalyser(tokens);
    var formulaValue = evaluatorAst(ast, cells);
    var formulaReferencedCells = tokens.filter(t => t.type === "CellReference").map(c => c.value);
    console.log("evaluate formula", tokens, ast, formulaValue, formulaReferencedCells);
    return {formulaValue, formulaReferencedCells};
}