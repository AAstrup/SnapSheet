import { Token, TokenType } from "./TokenTypes";

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < input.length) {
        const char = input[i];
        if (/\d/.test(char)) {
            let num = char;
            while (/\d|\./.test(input[i + 1])) {
                num += input[++i];
            }
            tokens.push({ type: TokenType.Number, value: num });
        } else if (/[+\-*/^]/.test(char)) {
            tokens.push({ type: TokenType.Operator, value: char });
        } else if (char === '(' || char === ')') {
            tokens.push({ type: TokenType.Parenthesis, value: char });
        } else if (/[A-Z]/.test(char) && /\d/.test(input[i + 1])) {
            let cellRef = char;
            while (/[A-Z]|\d/.test(input[i + 1])) {
                cellRef += input[++i];
            }

            if (input[i + 1] === ':' && /[A-Z]/.test(input[i + 2])) {
                cellRef += input[++i]; // Add ':'
                while (/[A-Z]|\d/.test(input[i + 1])) {
                    cellRef += input[++i];
                }
                tokens.push({ type: TokenType.CellRange, value: cellRef });
            } else {
                tokens.push({ type: TokenType.CellReference, value: cellRef });
            }
        } else if (/\s/.test(char)) {
            // Skip whitespace
        } else {
            throw new Error(`Unrecognized character: ${char}`);
        }

        i++;
    }

    tokens.push({ type: TokenType.EOF, value: '' });
    return tokens;
}
