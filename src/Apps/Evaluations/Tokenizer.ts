import { functionCollection } from "./Functions/FunctionCollection";

// Tokenizer.ts
export interface Token {
    type: 'OPERATOR' | 'IDENTIFIER' | 'NUMBER' | 'FUNCTION' | 'ERROR';
    value: string;
    functionParameters: FunctionParameter[] | undefined;
}

export interface FunctionParameter {
    tokens: Token[];
    functionParameters: string;
}

export class Tokenizer {
    public static tokenize(formula: string): Token[] {
        const tokens: Token[] = [];
        let position = 0;


        while (position < formula.length) {
            const currentChar = formula[position];

            if(currentChar === '='){
                position++;
                continue;    
            }

            const functionToken = formula.substring(position, position + 3);
            if (functionCollection[functionToken] != null) {
                const functionUsed = functionCollection[functionToken];
                position += 3; // Move past "SUM"

                // Ensure the next character is '('
                if (formula[position] === '(') {
                    position++; // Move past '('

                    let parameters = '';
                    while (position < formula.length && formula[position] !== ')') {
                        parameters += formula[position++];
                    }

                    // Move past ')'
                    if (formula[position] === ')') {
                        position++;
                    } else {
                        tokens.push({ type: 'ERROR', value: "Expected closing parenthesis for SUM function", functionParameters: undefined });
                        continue;
                    }

                    // Split parameters by ',' and trim whitespace
                    const paramList = parameters.split(',').map(param => { return { tokens: Tokenizer.tokenize(param.trim()), functionParameters: param.trim() } });

                    // Push SUM token with parameters
                    tokens.push({ type: 'FUNCTION', value: `SUM`, functionParameters: paramList });
                } else {
                    tokens.push({ type: 'ERROR', value: "Expected opening parenthesis after SUM", functionParameters: undefined });
                    continue;
                }
                continue;
            }
            else if (/\d/.test(currentChar)) {
                let number = '';
                while (position < formula.length && /\d/.test(formula[position])) {
                    number += formula[position++];
                }
                tokens.push({ type: 'NUMBER', value: number, functionParameters: undefined });
                continue;
            }
            else if (/[a-zA-Z]/.test(currentChar)) {
                let identifier = '';
                while (position < formula.length && /[a-zA-Z]/.test(formula[position])) {
                    identifier += formula[position++];
                }
                while (position < formula.length && /\d/.test(formula[position])) {
                    identifier += formula[position++];
                }
                tokens.push({ type: 'IDENTIFIER', value: identifier, functionParameters: undefined });
                continue;
            }
            else if (/[+\-*/()]/.test(currentChar)) {
                tokens.push({ type: 'OPERATOR', value: currentChar, functionParameters: undefined });
                position++;
                continue;
            }

            tokens.push({ type: 'ERROR', value: `Unknown character: ${currentChar}`, functionParameters: undefined });
        }

        return tokens;
    }
}
