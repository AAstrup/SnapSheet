// formulaUtils.ts

import { Cell, Spreadsheet } from './coreTypes';

export const recomputeReferences = (cell: Cell) => {
    if (cell.references) {
        cell.references.forEach(refCell => {
            if (refCell.formula) {
                try {
                    refCell.formulaCachedValue = eval(refCell.formula);
                } catch {
                    refCell.formulaCachedValue = refCell.formula;
                }
            }
            recomputeReferences(refCell);
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
    const updatedData = data.map((row, rIdx) =>
        row.map((cell, cIdx) => {
            if (rIdx === rowIndex && cIdx === colIndex) {
                const updatedCell = { ...cell, formula };
                try {
                    updatedCell.formulaCachedValue = eval(updatedCell.formula);
                } catch {
                    updatedCell.formulaCachedValue = formula;
                }
                recomputeReferences(updatedCell);
                return updatedCell;
            }
            return cell;
        })
    );
    setData(updatedData);
};
