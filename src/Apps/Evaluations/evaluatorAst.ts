import { Cell } from "../StateManagement/Types";
import { ASTNode } from "./ast";

export const evaluatorAst = (node: ASTNode, cells: Cell[][]): string | number | boolean => {
    switch (node.type) {
        case "Integer":
        case "String":
        case "Boolean":
            return node.value;

        case "CellReference":
            return cells[node.value.row][node.value.column].cachedFormulaValue;

        case "MathExpression":
            const leftValue = asNumber(evaluatorAst(node.left, cells));
            const rightValue = asNumber(evaluatorAst(node.right, cells));
            let result: number;

            switch (node.operator.value) {
                case "+":
                    result = leftValue + rightValue;
                    break;
                case "-":
                    result = leftValue - rightValue;
                    break;
                case "*":
                    result = leftValue * rightValue;
                    break;
                case "/":
                    if (rightValue === 0) {
                        throw new Error("Division by zero");
                    }
                    result = leftValue / rightValue;
                    break;
                default:
                    throw new Error(`Unknown operator: ${node.operator}`);
            }

            return result.toString();

        case "Sum":
            const sumResult = node.arguments
                .map(arg => asNumber(evaluatorAst(arg, cells)))
                .reduce((acc, value) => acc + value, 0);
            return sumResult.toString();

        case "If":
            const condition = evaluatorAst(node.condition, cells) === "true";
            return condition ? evaluatorAst(node.trueBranch, cells) : evaluatorAst(node.falseBranch, cells);

        default:
            throw new Error(`Unknown AST node type: ${node}`);
    }
};
function asNumber(arg0: string | number | boolean) {
    if(typeof arg0 === "boolean")
        throw new Error("Error");
    if(typeof arg0 === "string")
        return parseFloat(arg0);
    return arg0;
}

