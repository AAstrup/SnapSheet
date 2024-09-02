// ast.ts
import { CellPosition } from "../StateManagement/Types";
import { OperatorToken } from "./tokens";

export type LiteralNode = 
  | { type: "Integer"; value: number }
  | { type: "String"; value: string }
  | { type: "Boolean"; value: boolean };

export type CellReferenceNode = {
  type: "CellReference";
  value: CellPosition;
};

export type ExpressionNode = {
  type: "Expression";
  operator: OperatorToken;
  left: ASTNode;
  right: ASTNode;
};

export type FunctionNode = 
  | { type: "Sum"; arguments: ASTNode[] }
  | { type: "If"; condition: ASTNode; trueBranch: ASTNode; falseBranch: ASTNode };

export type ASTNode = LiteralNode | CellReferenceNode | ExpressionNode | FunctionNode;
