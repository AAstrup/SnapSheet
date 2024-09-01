import { CellPosition, Expr, Operator } from "./types";

export interface parseResult {
  expr: Expr;
  formulaReferencedCells: CellPosition[];
}

export function parseExpression(input: string): parseResult {
    input = input.replace(/\s+/g, ""); // Remove whitespace for easier parsing
  
    const tokens = input.split(/([+\-*/()]|sum|if|[A-Z][0-9]+)/);
    const formulaReferencedCells: CellPosition[] = [];
  
    interface precedenceType {
        [key: string]: number | undefined;
    }
    const precedence : precedenceType = {
      "+": 1, "-": 1,
      "*": 2, "/": 2
    };
  
    const applyOperator = (operator: Operator, right: Expr, left: Expr): Expr => {
      return { type: "Statement", leftExpr: left, operator, rightExpr: right };
    };
  
    const outputQueue: Expr[] = [];
    const operatorStack: (Operator | string)[] = [];
  
    tokens.forEach(token => {
      if (!token) return;
  
      if (parseInt(token).toString() === token) { // If it's a number
        outputQueue.push({ type: "Integer", value: parseInt(token) });
      } else if (["+", "-", "*", "/"].includes(token)) {
        while (operatorStack.length > 0 && precedence[token]! <= precedence[operatorStack[operatorStack.length - 1] as Operator]! && ["+", "-", "*", "/"].includes(operatorStack[operatorStack.length - 1])) {
          const operator = operatorStack.pop() as Operator;
          const right = outputQueue.pop()!;
          const left = outputQueue.pop()!;
          outputQueue.push(applyOperator(operator, right, left));
        }
        operatorStack.push(token as Operator);
      } else if (token.match(/[A-Z][0-9]+/)) { // Cell reference
        const row = token.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        const column = parseInt(token.slice(1));
        formulaReferencedCells.push({row, column});
        outputQueue.push({ type: "CellReference", value: { row, column } });
      } else if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
          const operator = operatorStack.pop() as Operator;
          const right = outputQueue.pop()!;
          const left = outputQueue.pop()!;
          outputQueue.push(applyOperator(operator, right, left));
        }
        operatorStack.pop(); // Pop the "("
      }
      // Handling for "sum" and "if" can be added here based on syntax
    });
  
    while (operatorStack.length > 0) {
      if (["+", "-", "*", "/"].includes(operatorStack[operatorStack.length - 1])) {
        const operator = operatorStack.pop() as Operator;
        const right = outputQueue.pop()!;
        const left = outputQueue.pop()!;
        outputQueue.push(applyOperator(operator, right, left));
      } else {
        operatorStack.pop(); // This might be a non-operator string, ignore it.
      }
    }
  
    return {
      expr: outputQueue[0],
      formulaReferencedCells,
    }
  }
  
  