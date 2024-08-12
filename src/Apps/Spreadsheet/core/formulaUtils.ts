// formulaUtils.ts

import { Cell, cellWithinBounds, getCell, getNewSheet, Spreadsheet, updateCell } from './coreTypes';
import { evaluateExpression, getCellRangeReferenceRowsColumns, getCellReferenceRowColumn } from './formulaCore/TokenEvaluator';
import { tokenize } from './formulaCore/Tokenizer';
import { buildDependencyMap } from './formulaCore/TokenizerDependency';
import { Token, TokenType } from './formulaCore/TokenTypes';

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


export const handleFormulaChange = (data: Spreadsheet, rowIndex: number, colIndex: number, formula: string, oldFormula: string, setData: (data: Spreadsheet) => void) => {
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

    var oldCellReferences = buildDependencyMap(oldFormula)
    
    const filteredReferences = new Set<Token>();
    oldCellReferences.forEach((token) => {
      if (!cellReferences.has(token)) {
        filteredReferences.add(token);
      }
    });

    updateCellReferences(filteredReferences, newData, rowIndex, colIndex, (referencedCell, refRow, refCol) => {        
        const cellsDependingOnCell = [...referencedCell.cellsDependingOnCell]
            .filter(c => !(c.col == colIndex && c.row == rowIndex) )

        updateCell(newData, refRow, refCol, {...referencedCell, cellsDependingOnCell});
    });

    updateCellReferences(cellReferences, newData, rowIndex, colIndex, (referencedCell, refRow, refCol) => {
        const cellsDependingOnCell = [...referencedCell.cellsDependingOnCell]
        cellsDependingOnCell.push({ row:rowIndex, col:colIndex })
        updateCell(newData, refRow, refCol, {...referencedCell, cellsDependingOnCell});
    });
    recomputeReferences(updatedCell, newData);

    setData(newData);
};

const updateCellReferences = (cellReferences: Set<Token>, newData: Spreadsheet, rowIndex: number, colIndex: number, cellAct: (cell: Cell, refRow: number, refCol: number) => void) =>
{
    cellReferences.forEach(cellReference => {
        switch (cellReference.type) {
            case TokenType.CellReference:
                const { row: refRow, col: refCol } = getCellReferenceRowColumn(cellReference);
                if(cellWithinBounds(newData, refRow, refCol))
                {
                    const referencedCell = getCell(newData, refRow, refCol);
                    cellAct(referencedCell, refRow, refCol);            
                }
                break;
            
            case TokenType.CellRange:
                const referencedCells = getCellRangeReferenceRowsColumns(cellReference);
                referencedCells.forEach(referencedCellElement => {
                    const referencedCellRef = getCell(newData, referencedCellElement.row, referencedCellElement.col);
                    updateCell(newData, refRow, refCol, referencedCellRef);
                });
            
                break;
        
            default:
                break;
        }
    });
}
