import { CellPosition, Expr, FunctionExpr, Operator } from "./types";

export interface parseResult {
  expr: Expr;
  formulaReferencedCells: CellPosition[];
}

export function parseExpression(input: string): parseResult {
  input = input.replace(/\s+/g, ""); // Remove whitespace for easier parsing
  const tokens = input.split(/([+\-*/(),]|\bsum\b|\bif\b|[A-Z][0-9]+)/);
  const outputQueue: Expr[] = [];
  const operatorStack: (Operator | string)[] = [];
  const functionStartStack: number[] = []; // Stack to track start indices of function arguments in the outputQueue
  const formulaReferencedCells: CellPosition[] = [];
   
  const precedence: { [key: string]: number } = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
  };

  tokens.forEach(token => {
    if (!token) return;

    if (parseInt(token).toString() === token) { // If it's a number
      outputQueue.push({ type: "Integer", value: parseInt(token) });
    } else if (["+", "-", "*", "/"].includes(token)) {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(" && precedence[token] <= precedence[operatorStack[operatorStack.length - 1] as Operator]) {
        const operator = operatorStack.pop() as Operator;
        const right = outputQueue.pop()!;
        const left = outputQueue.pop()!;
        outputQueue.push({ type: "Statement", leftExpr: left, operator, rightExpr: right });
      }
      operatorStack.push(token as Operator);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
        const operator = operatorStack.pop() as Operator;
        const right = outputQueue.pop()!;
        const left = outputQueue.pop()!;
        outputQueue.push({ type: "Statement", leftExpr: left, operator, rightExpr: right });
      }
      operatorStack.pop(); // Pop the "("
      if (functionStartStack.length > 0) {
        const startIdx = functionStartStack.pop()!;
        const functionName = outputQueue[startIdx] as FunctionExpr;
        const args = outputQueue.splice(startIdx + 1);
        if (functionName.type === "Sum") {
          outputQueue[startIdx] = { type: "Sum", values: args };
        } else if (functionName.type === "If") {
          if (args.length !== 3) {
            throw new Error('Incorrect number of arguments for "if" function');
          }
          outputQueue[startIdx] = { type: "If", condition: args[0], trueExpr: args[1], falseExpr: args[2] };
        }
      }
    } else if (token.match(/^\bsum\b$/) || token.match(/^\bif\b$/)) {
      const funcExpr: FunctionExpr = { type: token as any, values: [] } as any; // Placeholder for function starting
      outputQueue.push(funcExpr);
      functionStartStack.push(outputQueue.length - 1);
      operatorStack.push("(");
    } else if (token.match(/[A-Z][0-9]+/)) { // Cell reference
      const row = token.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      const column = parseInt(token.slice(1));
      formulaReferencedCells.push({row,column});
      outputQueue.push({ type: "CellReference", value: { row, column } });
    }
  });

  while (operatorStack.length > 0) {
    const operator = operatorStack.pop()!;
    const right = outputQueue.pop()!;
    const left = outputQueue.pop()!;
    outputQueue.push({ type: "Statement", leftExpr: left, operator: operator as Operator, rightExpr: right });
  }

  return {
    expr: outputQueue[0],
    formulaReferencedCells,
  }
}
  
  