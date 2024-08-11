import { Cell, getCell, getCellFromToken, Spreadsheet } from "../coreTypes";
import { Token, TokenType } from "./TokenTypes";

function columnToNumber(column: string): number {
    let number = 0;
    for (let i = 0; i < column.length; i++) {
        // Multiply the current value of 'number' by 26. 
        // This accounts for moving to the next "place" in a base-26 number system (like how base-10 works with decimal numbers).
        number = number * 26 

        // Add the value of the current character to 'number'.
        // 'column.charCodeAt(i)' gives the ASCII/Unicode value of the current character.
        // Subtracting 'A'.charCodeAt(0) - 1 converts 'A' to 1, 'B' to 2, ..., 'Z' to 26.
        + (column.charCodeAt(i) - ('A'.charCodeAt(0) - 1))
        
        // change to be 0 indexed
        -1;
    }
    return number;
}

export const getCellReferenceRowColumn = (token: Token) =>
{
    const row = parseInt(token.value.replace(/[^0-9]/g, ""), 10); // Extract the numeric part (row)
    const columnChar = token.value.replace(/[^A-Z]/g, ""); // Extract the alphabetic part (column)
    const col = columnToNumber(columnChar); // Convert the alphabetic part (column) to a number
    return {row, col};
}

export const getCellRangeReferenceRowsColumns = (token: Token) => 
{
    const [start, end] = token.value.split(':'); // Split the range into start and end references
                
    // Extract and convert the starting row and column
    const startRow = parseInt(start.replace(/[^0-9]/g, ""), 10); // Extract the numeric part (row)
    const startColumn = columnToNumber(start.replace(/[^A-Z]/g, "")); // Convert the alphabetic part (column) to a number
    
    // Extract and convert the ending row and column
    const endRow = parseInt(end.replace(/[^0-9]/g, ""), 10); // Extract the numeric part (row)
    const endColumn = columnToNumber(end.replace(/[^A-Z]/g, "")); // Convert the alphabetic part (column) to a number
    
    // Now you have the startRow, startColumn, endRow, and endColumn as numbers
    // You can now handle the range, for example, by iterating over each cell in the range
    const rowColumns: { row: number, col: number }[] = [];
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        for (let colIndex = startColumn; colIndex <= endColumn; colIndex++) {
            rowColumns.push({ row: rowIndex, col: colIndex });
        }
    }
    return rowColumns;
};
    

export function evaluateExpression(tokens: Token[], spreadsheet: Spreadsheet): number {
    let expression = "";

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.Number:
                expression += token.value;
                break;
            case TokenType.Operator:
                expression += token.value;
                break;
            case TokenType.Parenthesis:
                expression += token.value;
                break;
            case TokenType.CellReference:
                const cellValue = getCellFromToken(spreadsheet, token);
                expression += cellValue.formulaCachedValue;
                break;
            case TokenType.CellRange:
                const rangeValue = getCellRangeReferenceRowsColumns(token)
                    .map(cell => getCell(spreadsheet, cell.row, cell.col).formulaCachedValue)
                    .reduce((c1,c2) => parseFloat(c1?.toString() ?? "") + parseFloat(c2?.toString() ?? ""), 0);
                expression += rangeValue!.toString();
                break;
            case TokenType.EOF:
                break;
            default:
                throw new Error(`Unsupported token type: ${token.type}`);
        }
    }

    return eval(expression);
}
