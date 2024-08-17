import { state, setState, UpdateCellFormula } from "../StateManagement/Statemanager";
import { TextMode } from "../StateManagement/Types";

export function handleKeyPress(event: KeyboardEvent) {
    const selectedCell = state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected

    const { row, column } = selectedCell;
    const cell = state.cells[row][column];

    // Ensure we are in TextMode
    if ('cursorPosition' in state.mode) {
        const cursorPosition = (state.mode as TextMode).cursorPosition;
        let newFormula = cell.formula;

        const moveCursor = (newPosition: number) => {
            setState("mode", { ...state.mode, cursorPosition: Math.max(0, Math.min(newPosition, newFormula.length)) } as TextMode);
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
            if (event.ctrlKey) {
                // Delete the word before the cursor
                const lastSpacePosition = newFormula.lastIndexOf(' ', cursorPosition - 1);
                newFormula = newFormula.slice(0, lastSpacePosition === -1 ? 0 : lastSpacePosition) + newFormula.slice(cursorPosition);
                moveCursor(lastSpacePosition === -1 ? 0 : lastSpacePosition);
            } else if (cursorPosition > 0) {
                // Delete the character before the cursor
                newFormula = newFormula.slice(0, cursorPosition - 1) + newFormula.slice(cursorPosition);
                moveCursor(cursorPosition - 1);
            }
        } else if (event.key === "Delete") {
            if (event.ctrlKey) {
                // Delete the word after the cursor
                const nextSpacePosition = newFormula.indexOf(' ', cursorPosition);
                newFormula = newFormula.slice(0, cursorPosition) + newFormula.slice(nextSpacePosition === -1 ? newFormula.length : nextSpacePosition);
            } else if (cursorPosition < newFormula.length) {
                // Delete the character at the cursor
                newFormula = newFormula.slice(0, cursorPosition) + newFormula.slice(cursorPosition + 1);
            }
        } else if (event.key.length === 1) {
            // Insert the new character at the cursor position
            newFormula = newFormula.slice(0, cursorPosition) + event.key + newFormula.slice(cursorPosition);
            moveCursor(cursorPosition + 1);
        } else {
            return; // Ignore other keys
        }

        // Update the formula in the state
        setState("cells", row, column, "formula", newFormula);
        UpdateCellFormula(row, column, newFormula);
    }
}
