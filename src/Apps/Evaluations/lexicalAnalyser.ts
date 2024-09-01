import {
    Token,
    LiteralTokenPatterns,
    MathOperatorPattern,
    CellReferencePattern,
    FunctionTokenPatterns,
    SymbolTokenPatterns
} from './tokens';

export const tokenize = (formula: string): Token[] => {
    const tokens: Token[] = [];

    // Combine all regex patterns into one
    const combinedRegex = new RegExp(
        `${LiteralTokenPatterns.Integer.source}|${LiteralTokenPatterns.String.source}|${LiteralTokenPatterns.Boolean.source}|${CellReferencePattern.source}|${MathOperatorPattern.source}|${FunctionTokenPatterns.Sum.source}|${FunctionTokenPatterns.If.source}|${SymbolTokenPatterns.LeftParenthesis.source}|${SymbolTokenPatterns.RightParenthesis.source}|${SymbolTokenPatterns.Comma.source}`,
        'g'
    );

    // Helper function to determine the type of a match and create the appropriate token
    const createTokenFromMatch = (match: string): Token | null => {
        if (CellReferencePattern.test(match)) {
            const row = parseInt(match.slice(1), 10) - 1; // -1 as we want users 1 indexed changed to 0 indexed
            const column = match.charCodeAt(0) - 65; // Assuming column letters start from A=0
            return { type: "CellReference", value: { row, column } };
        }
        if (MathOperatorPattern.test(match)) {
            return { type: "MathOperator", value: match as "+" | "-" | "*" | "/" };
        }
        if (FunctionTokenPatterns.Sum.test(match)) {
            return { type: "Sum" };
        }
        if (FunctionTokenPatterns.If.test(match)) {
            return { type: "If" };
        }
        if (SymbolTokenPatterns.LeftParenthesis.test(match)) {
            return { type: "LeftParenthesis" };
        }
        if (SymbolTokenPatterns.RightParenthesis.test(match)) {
            return { type: "RightParenthesis" };
        }
        if (SymbolTokenPatterns.Comma.test(match)) {
            return { type: "Comma" };
        }
        if (LiteralTokenPatterns.Integer.test(match)) {
            return { type: "Integer", value: parseInt(match, 10) };
        }
        if (LiteralTokenPatterns.String.test(match)) {
            return { type: "String", value: match.slice(1, -1) }; // Remove surrounding quotes
        }
        if (LiteralTokenPatterns.Boolean.test(match)) {
            return { type: "Boolean", value: match === "true" };
        }
        return null; // In case the match doesn't fit any pattern
    };

    let match;

    // Iterate through all matches and create tokens
    while ((match = combinedRegex.exec(formula)) !== null) {
        const token = createTokenFromMatch(match[0]);
        if (token) {
            tokens.push(token);
        }
    }

    return tokens;
};
