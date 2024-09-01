import { Cell } from "../StateManagement/Types";
import { Expr } from "./types";

export function evaluateExpr(expr: Expr, cells: Cell[][]): number | string | boolean {
    switch (expr.type) {
      case "Integer":
      case "String":
      case "Boolean":
        return expr.value;
      case "Statement":
        const left = evaluateExpr(expr.leftExpr, cells);
        const right = evaluateExpr(expr.rightExpr, cells);
        if(typeof left !== 'number')
            throw new Error("left is not a number, value was " + left.toString());
        if(typeof right !== 'number')
            throw new Error("right is not a number, value was " + right.toString());
        switch (expr.operator) {
          case "+":
            return left + right;
          case "-":
            return left - right;
          case "*":
            return left * right;
          case "/":
            return left / right;
          default:
            throw new Error("Unsupported operator");
        }
      case "Sum":
        return expr.values.map((exprVal) =>evaluateExpr(exprVal, cells)).reduce((a, b) => {
            if(typeof a !== 'number')
                throw new Error("left is not a number, value was " + a.toString());
            if(typeof b !== 'number')
                throw new Error("left is not a number, value was " + b.toString());
            return a + b;
        }, 0);
      case "If":
        return evaluateExpr(expr.condition, cells) ? evaluateExpr(expr.trueExpr, cells) : evaluateExpr(expr.falseExpr, cells);
      case "CellReference":
        const cellRef = cells[expr.value.row][expr.value.column];
        return cellRef.cachedFormulaValue;
      default:
        throw new Error("Unknown expression type");
    }
  }