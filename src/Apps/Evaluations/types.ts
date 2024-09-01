export type ValueExpr = 
  | { type: "Integer"; value: number }
  | { type: "String"; value: string }
  | { type: "Boolean"; value: boolean };

export type Operator = "+" | "-" | "*" | "/";

export type CellPosition = {
  row: number;
  column: number;
};

export type FunctionExpr = 
  | { type: "Sum"; values: Expr[] }
  | { type: "If"; condition: Expr; trueExpr: Expr; falseExpr: Expr }
  | { type: "CellReference"; value: CellPosition }
  | { type: "Statement"; leftExpr: Expr; operator: Operator; rightExpr: Expr };

  export type Expr = ValueExpr | FunctionExpr;



