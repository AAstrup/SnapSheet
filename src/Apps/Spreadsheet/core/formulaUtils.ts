// formulaUtils.ts

import { Cell, getCell, getNewSheet, Spreadsheet, updateCell } from './coreTypes';
import { evaluateExpression, getCellRangeReferenceRowsColumns, getCellReferenceRowColumn } from './formulaCore/TokenEvaluator';
import { tokenize } from './formulaCore/Tokenizer';
import { buildDependencyMap } from './formulaCore/TokenizerDependency';
import { TokenType } from './formulaCore/TokenTypes';

export const recomputeReferences = (cell: Cell, spreadsheet: Spreadsheet) => {
    if (cell.cellsDependingOnCell) {
        cell.cellsDependingOnCell.forEach(refCell => {
            const refCellLookup = getCell(spreadsheet, refCell.row, refCell.col);
            if (refCellLookup.formula) {
                try {
                    refCellLookup.formulaCachedValue = evaluateExpression(tokenize(refCellLookup.formula), spreadsheet).toString();
                } catch {
                    refCellLookup.formulaCachedValue = refCellLookup.formula;
                }
            }
            recomputeReferences(refCellLookup, spreadsheet);
        });
    }
};


export const handleFormulaChange = (
    data: Spreadsheet,
    rowIndex: number,
    colIndex: number,
    formula: string,
    setData: (data: Spreadsheet) => void
) => {
    var cellReferences = buildDependencyMap(formula)
    var newData = getNewSheet(data);

    const cell = getCell(newData, rowIndex, colIndex);
    const updatedCell = { ...cell, formula };
    newData[rowIndex][colIndex] = updatedCell;
    try {
        const formulaTokens = tokenize(updatedCell.formula);
        updatedCell.formulaCachedValue = evaluateExpression(formulaTokens, data).toString();
    } catch {
        updatedCell.formulaCachedValue = formula;
    }
    updateCell(newData, rowIndex, colIndex, updatedCell);

    cellReferences.forEach(cellReference => {
        switch (cellReference.type) {
            case TokenType.CellReference:
                const { row, col } = getCellReferenceRowColumn(cellReference);
                const referencedCell = getCell(newData, row, col);
                referencedCell.cellsDependingOnCell.push({ row, col })
                updateCell(newData, row, col, referencedCell);
            
                break;
            
            case TokenType.CellRange:
                const referencedCells = getCellRangeReferenceRowsColumns(cellReference);
                referencedCells.forEach(referencedCellElement => {
                    const referencedCellRef = getCell(newData, referencedCellElement.row, referencedCellElement.col);
                    updateCell(newData, row, col, referencedCellRef);
                });
            
                break;
        
            default:
                break;
        }
    });
    recomputeReferences(updatedCell, newData);

    setData(newData);
};
