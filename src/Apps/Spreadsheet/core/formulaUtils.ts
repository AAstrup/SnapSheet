import { Cell, Spreadsheet } from './coreTypes';

export type DependencyMap = {
    [key: string]: string[]; // Key is the cell identifier (e.g., "A1"), value is an array of cells that depend on it
};

// Helper function to generate a cell identifier (e.g., "A1")
const getCellIdentifier = (rowIndex: number, colIndex: number): string => {
    const column = String.fromCharCode(65 + colIndex); // Convert column index to letter (e.g., 0 -> A, 1 -> B)
    return `${column}${rowIndex + 1}`;
};

// Parse the formula to replace references with their corresponding values
const parseFormula = (formula: string, data: Spreadsheet): string => {
    return formula.replace(/[A-Z]\d+/g, (match) => {
        const col = match.charCodeAt(0) - 65; // Convert letter to column index
        const row = parseInt(match.slice(1), 10) - 1; // Convert number to row index
        return data[row]?.[col]?.formulaCachedValue?.toString() ?? '0';
    });
};

export const recomputeReferences = (
    rowIndex: number,
    colIndex: number,
    data: Spreadsheet,
    dependencyMap: DependencyMap
) => {
    const cellId = getCellIdentifier(rowIndex, colIndex);

    if (dependencyMap[cellId]) {
        dependencyMap[cellId].forEach((dependentCellId) => {
            const [dependentRowIndex, dependentColIndex] = dependentCellId
                .match(/([A-Z])(\d+)/)!
                .slice(1)
                .map((v, i) => (i === 0 ? v.charCodeAt(0) - 65 : parseInt(v, 10) - 1));

            const dependentCell = data[dependentRowIndex][dependentColIndex];
            if (dependentCell.formula) {
                try {
                    dependentCell.formulaCachedValue = eval(parseFormula(dependentCell.formula, data));
                } catch {
                    dependentCell.formulaCachedValue = dependentCell.formula;
                }
                recomputeReferences(dependentRowIndex, dependentColIndex, data, dependencyMap);
            }
        });
    }
};

export const handleFormulaChange = (
    data: Spreadsheet,
    rowIndex: number,
    colIndex: number,
    formula: string,
    setData: (data: Spreadsheet) => void,
    dependencyMap: DependencyMap
) => {
    const updatedData = data.map((row, rIdx) =>
        row.map((cell, cIdx) => {
            if (rIdx === rowIndex && cIdx === colIndex) {
                const updatedCell = { ...cell, formula };
                const cellId = getCellIdentifier(rowIndex, colIndex);

                // Parse formula and update cached value
                try {
                    updatedCell.formulaCachedValue = eval(parseFormula(formula, data));
                } catch {
                    updatedCell.formulaCachedValue = formula;
                }

                // Update dependency map
                const matches = formula.match(/[A-Z]\d+/g) || [];
                dependencyMap[cellId] = matches;

                matches.forEach((ref) => {
                    if (!dependencyMap[ref]) {
                        dependencyMap[ref] = [];
                    }
                    dependencyMap[ref].push(cellId);
                });

                recomputeReferences(rowIndex, colIndex, data, dependencyMap);
                return updatedCell;
            }
            return cell;
        })
    );
    setData(updatedData);
};
