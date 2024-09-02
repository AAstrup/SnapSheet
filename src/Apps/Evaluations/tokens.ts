// Token types for literal values
export type LiteralToken = 
  | { type: "Integer"; value: number }
  | { type: "String"; value: string }
  | { type: "Boolean"; value: boolean };

// Patterns for literal tokens
export const LiteralTokenPatterns = {
  Integer: /\d+/,
  String: /".*?"/,
  Boolean: /\btrue\b|\bfalse\b/,
};

// Token type for math operators
export type OperatorToken = { type: "Operator"; value: "+" | "-" | "*" | "/" | ">" | "<" | "=" | "<=" | ">=" };

// Pattern for math operators
export const MathOperatorPattern = /\+|\-|\*|\/|\>|\<|\=|\<\=|\>\=/;

// Token type for cell references
export type CellReferenceToken = { type: "CellReference"; value: { row: number; column: number } };

// Pattern for cell references
export const CellReferencePattern = /[A-Z]\d+/;

// Token types for functions (no nested expressions, just identifiers)
export type FunctionToken = 
  | { type: "Sum" }
  | { type: "If" };

// Patterns for function tokens
export const FunctionTokenPatterns = {
  Sum: /\bSum\b/,
  If: /\bIf\b/,
};

// Token types for symbols like parentheses and commas
export type SymbolToken = 
  | { type: "LeftParenthesis" }
  | { type: "RightParenthesis" }
  | { type: "Comma" };

// Patterns for symbol tokens
export const SymbolTokenPatterns = {
  LeftParenthesis: /\(/,
  RightParenthesis: /\)/,
  Comma: /,/,
};

// General token type
export type Token = 
  | LiteralToken 
  | OperatorToken 
  | CellReferenceToken 
  | FunctionToken 
  | SymbolToken;
