import { MathOperatorToken, Token } from "./tokens";
import { ASTNode, LiteralNode, CellReferenceNode, MathExpressionNode, FunctionNode } from "./ast";

// Recursive descent parser functions

const parsePrimary = (tokens: Token[], index: number): [ASTNode, number] => {
    const token = tokens[index];

    if (token.type === "Integer" || token.type === "String" || token.type === "Boolean") {
        return [{ type: token.type, value: token.value } as LiteralNode, index + 1];
    }

    if (token.type === "CellReference") {
        return [{ type: "CellReference", value: token.value } as CellReferenceNode, index + 1];
    }

    if (token.type === "Sum" || token.type === "If") {
        return parseFunction(tokens, index);
    }

    if (token.type === "LeftParenthesis") {
        const [expr, nextIndex] = parseExpression(tokens, index + 1);
        if (tokens[nextIndex]?.type !== "RightParenthesis") {
            throw new Error("Expected right parenthesis");
        }
        return [expr, nextIndex + 1];
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
};

const parseFunction = (tokens: Token[], index: number): [ASTNode, number] => {
    const token = tokens[index];

    if (token.type === "Sum") {
        const args: ASTNode[] = [];
        index++;
        if (tokens[index]?.type !== "LeftParenthesis") {
            throw new Error("Expected left parenthesis after Sum");
        }
        index++;

        while (tokens[index]?.type !== "RightParenthesis") {
            const [arg, nextIndex] = parseExpression(tokens, index);
            args.push(arg);
            index = nextIndex;

            if (tokens[index]?.type === "Comma") {
                index++; // Skip the comma
            } else if (tokens[index]?.type !== "RightParenthesis") {
                throw new Error("Expected comma or right parenthesis in Sum function");
            }
        }

        return [{ type: "Sum", arguments: args } as FunctionNode, index + 1];
    }

    if (token.type === "If") {
        index++;
        if (tokens[index]?.type !== "LeftParenthesis") {
            throw new Error("Expected left parenthesis after If");
        }
        index++;

        const [condition, nextIndex1] = parseExpression(tokens, index);
        if (tokens[nextIndex1]?.type !== "Comma") {
            throw new Error("Expected comma after condition in If");
        }

        const [trueBranch, nextIndex2] = parseExpression(tokens, nextIndex1 + 1);
        if (tokens[nextIndex2]?.type !== "Comma") {
            throw new Error("Expected comma after trueBranch in If");
        }

        const [falseBranch, nextIndex3] = parseExpression(tokens, nextIndex2 + 1);
        if (tokens[nextIndex3]?.type !== "RightParenthesis") {
            throw new Error("Expected right parenthesis after If arguments");
        }

        return [{ type: "If", condition, trueBranch, falseBranch } as FunctionNode, nextIndex3 + 1];
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
};


const parseExpression = (tokens: Token[], index: number): [ASTNode, number] => {
    let [left, nextIndex] = parsePrimary(tokens, index);

    while (tokens[nextIndex]?.type === "MathOperator") {
        const operator = tokens[nextIndex] as MathOperatorToken;
        const [right, nextNextIndex] = parsePrimary(tokens, nextIndex + 1);
        left = { type: "MathExpression", operator, left, right } as MathExpressionNode;
        nextIndex = nextNextIndex;
    }

    return [left, nextIndex];
};

// The main function to parse the tokens into an AST

export const syntaticAnalyser = (tokens: Token[]): ASTNode => {
    const [ast, index] = parseExpression(tokens, 0);

    if (index < tokens.length) {
        throw new Error("Unexpected tokens after end of expression");
    }

    return ast;
};
