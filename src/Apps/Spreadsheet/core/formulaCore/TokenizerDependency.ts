import { tokenize } from "./Tokenizer";
import { Token, TokenType } from "./TokenTypes";

export function buildDependencyMap(formula: string): Set<Token> {
    const tokens = tokenize(formula);
    const referencedCells = new Set<Token>();

    for (const token of tokens) {
        if (token.type === TokenType.CellReference || token.type === TokenType.CellRange) {
            referencedCells.add(token);
        }
    }

    return referencedCells;
}
