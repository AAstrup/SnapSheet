import { state, setState, UpdateCellFormula, deselectCell } from "../StateManagement/Statemanager";
import { MarkMode, TextMode } from "../StateManagement/Types";

export function textModeHandleKeyPress(event: KeyboardEvent, textMode: TextMode) {
    const selectedCell = state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected

    const { row, column } = selectedCell;
    const cell = state.cells[row][column];

    let cursorPosition = textMode.cursorPosition;
    const cursorSelectionStartPosition = textMode.cursorSelectionStartPosition;
    let newFormula = cell.formula;

    const moveCursor = (newPosition: number) => {
        cursorPosition = Math.max(0, Math.min(newPosition, newFormula.length));
        if (event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            setState("mode", { 
                textMode: true, 
                cursorPosition: cursorPosition,
                cursorSelectionStartPosition: cursorSelectionStartPosition 
            } as TextMode);
        } else {
            setState("mode", { 
                textMode: true, 
                cursorPosition: cursorPosition,
                cursorSelectionStartPosition: cursorPosition 
            } as TextMode);
        }
    };

    if (event.key === "ArrowLeft") {
        if (event.ctrlKey) {
            // Move cursor left by one word
            const newPosition = newFormula.lastIndexOf(' ', cursorPosition - 1);
            moveCursor(newPosition === -1 ? 0 : newPosition);
        } else {
            // Move cursor left by one character
            moveCursor(cursorPosition - 1);
        }
    } else if (event.key === "ArrowRight") {
        if (event.ctrlKey) {
            // Move cursor right by one word
            const newPosition = newFormula.indexOf(' ', cursorPosition + 1);
            moveCursor(newPosition === -1 ? newFormula.length : newPosition + 1);
        } else {
            // Move cursor right by one character
            moveCursor(cursorPosition + 1);
        }
    } else if (event.key === "Backspace") {
        if (cursorPosition !== cursorSelectionStartPosition) {
            // Delete selected text
            const start = Math.min(cursorPosition, cursorSelectionStartPosition);
            const end = Math.max(cursorPosition, cursorSelectionStartPosition);
            newFormula = newFormula.slice(0, start) + newFormula.slice(end);
            moveCursor(start);
        } else if (cursorPosition > 0) {
            // Delete the character before the cursor
            newFormula = newFormula.slice(0, cursorPosition - 1) + newFormula.slice(cursorPosition);
            moveCursor(cursorPosition - 1);
        }
    } else if (event.key === "Enter") {
        deselectCell();
    } else if (event.key === "Delete") {
        if (cursorPosition !== cursorSelectionStartPosition) {
            // Delete selected text
            const start = Math.min(cursorPosition, cursorSelectionStartPosition);
            const end = Math.max(cursorPosition, cursorSelectionStartPosition);
            newFormula = newFormula.slice(0, start) + newFormula.slice(end);
            moveCursor(start);
        } else if (cursorPosition < newFormula.length) {
            // Delete the character at the cursor
            newFormula = newFormula.slice(0, cursorPosition) + newFormula.slice(cursorPosition + 1);
        }
    } else if (event.key.length === 1) {
        // Replace selected text or insert character at cursor position
        if (cursorPosition !== cursorSelectionStartPosition) {
            const start = Math.min(cursorPosition, cursorSelectionStartPosition);
            const end = Math.max(cursorPosition, cursorSelectionStartPosition);
            newFormula = newFormula.slice(0, start) + event.key + newFormula.slice(end);
            moveCursor(start + 1);
        } else {
            newFormula = newFormula.slice(0, cursorPosition) + event.key + newFormula.slice(cursorPosition);
            moveCursor(cursorPosition + 1);
        }
    } else {
        return; // Ignore other keys
    }

    if(newFormula !== cell.formula) {
        // Update the formula in the state
        setState("cells", row, column, "formula", newFormula);
        UpdateCellFormula(row, column, newFormula);
    }
}
