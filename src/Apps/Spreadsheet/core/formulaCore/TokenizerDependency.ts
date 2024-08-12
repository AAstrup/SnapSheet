import { tokenize } from "./Tokenizer";
import { Token, TokenType } from "./TokenTypes";

export function buildDependencyMap(formula: string): Set<Token> {
    let tokens : Token[] = []; 
    try
    {
        tokens = tokenize(formula);
    }
    catch(e)
    {
        return new Set<Token>();
    }
    const referencedCells = new Set<Token>();

    for (const token of tokens) {
        if (token.type === TokenType.CellReference || token.type === TokenType.CellRange) {
            referencedCells.add(token);
        }
    }

    return referencedCells;
}
