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

        case "Expression":
            const leftValue = evaluatorAst(node.left, cells);
            const rightValue = evaluatorAst(node.right, cells);

            switch (node.operator.value) {
                case "+":
                    return asNumber(leftValue) + asNumber(rightValue);
                case "-":
                    return asNumber(leftValue) - asNumber(rightValue);
                case "*":
                    return asNumber(leftValue) * asNumber(rightValue);
                case "/":
                    if (rightValue === 0) {
                        throw new Error("Division by zero");
                    }
                    return asNumber(leftValue) / asNumber(rightValue);
                case "<":
                    return asNumber(leftValue) < asNumber(rightValue);
                case "<=":
                    return asNumber(leftValue) <= asNumber(rightValue);
                case ">":
                    return asNumber(leftValue) > asNumber(rightValue);
                case ">=":
                    return asNumber(leftValue) >= asNumber(rightValue);
                case "=":
                    return asNumber(leftValue) === asNumber(rightValue);

                default:
                    throw new Error(`Unknown operator: ${node.operator}`);
            }

        case "Sum":
            const sumResult = node.arguments
                .map(arg => asNumber(evaluatorAst(arg, cells)))
                .reduce((acc, value) => acc + value, 0);
            return sumResult.toString();

        case "If":
            const conditionAst = evaluatorAst(node.condition, cells);
            const conditionTrue = conditionAst === "true" || conditionAst === true;
            return conditionTrue ? evaluatorAst(node.trueBranch, cells) : evaluatorAst(node.falseBranch, cells);

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

