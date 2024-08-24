import { state, setState, UpdateCellFormula, deselectCell, selectCell } from "../StateManagement/Statemanager";
import { MarkMode, TextMode } from "../StateManagement/Types";

export function markModeHandleKeyPress(event: KeyboardEvent, markMode: MarkMode) {
    const selectedCell = state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected

    let { row, column } = selectedCell;

    // Utility function to move the selection
    const moveSelection = (newRow: number, newColumn: number) => {
        if (event.shiftKey) {
            // If Shift is held, add to the selection
            setState("selectedCells", cells => [...cells, { row: newRow, column: newColumn }]);
        } else {
            // Otherwise, select only the new cell
            selectCell(newRow, newColumn);
        }
    };

    if (event.key === "F2") {
        setState("mode", { 
            textMode: true, 
            cursorPosition: 0,
            cursorSelectionStartPosition: 0 
        } as TextMode);
    }



    // Delete: Clear the content of the selected cell(s)
    if (event.key === "Delete") {
        state.selectedCells.forEach(cellPosition => {
            UpdateCellFormula(cellPosition.row, cellPosition.column, "");
        });
    }

    // CTRL + Arrow keys: Jump to the next non-empty cell in the direction pressed
    if (event.ctrlKey) {
        const findNextNonEmptyCell = (startRow: number, startColumn: number, rowIncrement: number, colIncrement: number) => {
            let currentRow = startRow;
            let currentColumn = startColumn;

            while (currentRow >= 0 && currentRow < state.cells.length &&
                   currentColumn >= 0 && currentColumn < state.cells[currentRow].length) {
                currentRow += rowIncrement;
                currentColumn += colIncrement;

                if (state.cells[currentRow] && state.cells[currentRow][currentColumn]) {
                    const cell = state.cells[currentRow][currentColumn];
                    if (cell.formula) {
                        return { row: currentRow, column: currentColumn };
                    }
                }
            }
            return { row: startRow, column: startColumn }; // Return the original cell if no non-empty cell is found
        };

        if (event.key === "ArrowUp") {
            const nextCell = findNextNonEmptyCell(row, column, -1, 0);
            selectCell(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowDown") {
            const nextCell = findNextNonEmptyCell(row, column, 1, 0);
            selectCell(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowLeft") {
            const nextCell = findNextNonEmptyCell(row, column, 0, -1);
            selectCell(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowRight") {
            const nextCell = findNextNonEmptyCell(row, column, 0, 1);
            selectCell(nextCell.row, nextCell.column);
        }
    }
    else
    {
        // Arrow keys: Navigate between cells
        if (event.key === "ArrowUp") {
            moveSelection(Math.max(0, row - 1), column);
        } else if (event.key === "ArrowDown") {
            moveSelection(Math.min(state.cells.length - 1, row + 1), column);
        } else if (event.key === "ArrowLeft") {
            moveSelection(row, Math.max(0, column - 1));
        } else if (event.key === "ArrowRight") {
            moveSelection(row, Math.min(state.cells[row].length - 1, column + 1));
        }
    }
}
