import { state, setState, UpdateCellFormulaAndEvaluate, deselectCell, addColumn, addRow, selectCell, updateViewPort } from "../StateManagement/Statemanager";
import { MarkMode, TextMode } from "../StateManagement/Types";
import { textModeHandleKeyPress } from "./TextModeKeyPressHandler";

const arrowKeys = ["ArrowUp","ArrowDown", "ArrowLeft", "ArrowRight"]
function isNonSpecialKey(event: KeyboardEvent): boolean {
    const specialKeys = [
        'Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Pause', 'CapsLock',
        'Escape', 'Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp',
        'ArrowRight', 'ArrowDown', 'Insert', 'Delete', 'Meta', 'ContextMenu', 'NumLock',
        'ScrollLock', 'PrintScreen'
    ];

    return event.key.length === 1 && !specialKeys.includes(event.key);
}

export function markModeHandleKeyPress(event: KeyboardEvent, markMode: MarkMode) {
    const selectedCell = markMode.selectCellPosition || state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected
    const selectCellStartPosition = markMode.selectCellStartPosition || state.selectedCells[0]; // Assuming a single cell selection

    let { row, column } = selectedCell;

    // Initialize selection start position if not already set
    if (!markMode.selectCellStartPosition) {
        setState("mode", {
            ...markMode, // Preserve other properties in MarkMode
            selectCellStartPosition: { row, column },
            selectCellPosition: { row, column }
        });
    }

    // Utility function to move the selection
    const moveSelection = (newRow: number, newColumn: number) => {
        if (event.shiftKey) {
            // Update selectCellPosition with the new cell
            updateViewPort(newRow, newColumn);
            setState("mode", {
                ...markMode, // Preserve other properties in MarkMode
                selectCellPosition: { row: newRow, column: newColumn }
            });

            // Get the range of cells and update selectedCells
            const newSelection = getCellsInRange(selectCellStartPosition, { row: newRow, column: newColumn });
            setState("selectedCells", newSelection);
        } else {
            // Select only the new cell and update both start and current positions
            selectCell(newRow, newColumn);
            setState("mode", {
                ...markMode, // Preserve other properties in MarkMode
                selectCellStartPosition: { row: newRow, column: newColumn },
                selectCellPosition: { row: newRow, column: newColumn }
            });
        }
    };

    if (event.key === "F2") {
        setState("mode", { 
            textMode: true, 
            cursorPosition: 0,
            cursorSelectionStartPosition: 0 
        } as TextMode);
    }
    else if (event.key === "Delete" || event.key === "Backspace") {
        state.selectedCells.forEach(cellPosition => {
            UpdateCellFormulaAndEvaluate(cellPosition.row, cellPosition.column, "");
        });
    }

    // CTRL + Arrow keys: Jump to the next non-empty cell in the direction pressed
    if (arrowKeys.indexOf(event.key) > -1 && event.ctrlKey) {
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

            var withinBoundsRow = Math.max(Math.min(currentRow, state.cells.length - 1), 0)
            var withinBoundsColumn = Math.max(Math.min(currentColumn, state.cells[withinBoundsRow].length - 1), 0)
            return { row: withinBoundsRow, column: withinBoundsColumn }; 
        };

        if (event.key === "ArrowUp") {
            const nextCell = findNextNonEmptyCell(row, column, -1, 0);
            moveSelection(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowDown") {
            const nextCell = findNextNonEmptyCell(row, column, 1, 0);
            moveSelection(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowLeft") {
            const nextCell = findNextNonEmptyCell(row, column, 0, -1);
            moveSelection(nextCell.row, nextCell.column);
        } else if (event.key === "ArrowRight") {
            const nextCell = findNextNonEmptyCell(row, column, 0, 1);
            moveSelection(nextCell.row, nextCell.column);
        }
    }
    else if(arrowKeys.indexOf(event.key) > -1)
    {
        // Arrow keys: Navigate between cells
        if (event.key === "ArrowUp") {
            moveSelection(Math.max(0, row - 1), column);
        } else if (event.key === "ArrowDown") {
            if (row === state.cells.length - 1) {
                addRow();
            }
            moveSelection(row + 1, column);
        } else if (event.key === "ArrowLeft") {
            moveSelection(row, Math.max(0, column - 1));
        } else if (event.key === "ArrowRight") {
            if (column === state.cells[row].length - 1) {
                addColumn();
            }
            moveSelection(row, column + 1);
        }
    }
    else if(isNonSpecialKey(event))
    {
        const textMode = { 
            textMode: true, 
            cursorPosition: 0,
            cursorSelectionStartPosition: 0 
        } as TextMode;
        setState("mode", textMode);
        textModeHandleKeyPress(event, textMode);
    }
    else {
        event.preventDefault();
    }
}

// Helper function to get all cells in a rectangular range
function getCellsInRange(start: { row: number, column: number }, end: { row: number, column: number }) {
    const cellsInRange = [];
    const rowStart = Math.min(start.row, end.row);
    const rowEnd = Math.max(start.row, end.row);
    const colStart = Math.min(start.column, end.column);
    const colEnd = Math.max(start.column, end.column);

    for (let row = rowStart; row <= rowEnd; row++) {
        for (let col = colStart; col <= colEnd; col++) {
            cellsInRange.push({ row, column: col });
        }
    }

    return cellsInRange;
}
