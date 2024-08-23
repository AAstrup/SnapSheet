// Tokenizer.ts
export interface Token {
    type: string;
    value: string;
}

export class Tokenizer {
    public static tokenize(formula: string): Token[] {
        const tokens: Token[] = [];
        let position = 0;

        while (position < formula.length) {
            const currentChar = formula[position];

            if(currentChar === '='){
                continue;    
            }
            if (/\d/.test(currentChar)) {
                let number = '';
                while (position < formula.length && /\d/.test(formula[position])) {
                    number += formula[position++];
                }
                tokens.push({ type: 'NUMBER', value: number });
                continue;
            }

            if (/[a-zA-Z]/.test(currentChar)) {
                let identifier = '';
                while (position < formula.length && /[a-zA-Z]/.test(formula[position])) {
                    identifier += formula[position++];
                }
                tokens.push({ type: 'IDENTIFIER', value: identifier });
                continue;
            }

            if (/[+\-*/()]/.test(currentChar)) {
                tokens.push({ type: 'OPERATOR', value: currentChar });
                position++;
                continue;
            }

            throw new Error(`Unknown character: ${currentChar}`);
        }

        return tokens;
    }
}
