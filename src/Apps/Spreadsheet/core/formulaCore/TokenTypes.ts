export enum TokenType {
    Number,
    Operator,
    Parenthesis,
    CellReference,
    CellRange,
    EOF
}

export interface Token {
    type: TokenType;
    value: string;
}
