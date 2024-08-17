// Handlers/KeyPressHandler.ts
import { state, setState, UpdateCellFormula } from "../StateManagement/Statemanager";

export function handleKeyPress(event: KeyboardEvent) {
    const selectedCell = state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected

    const { row, column } = selectedCell;
    const cell = state.cells[row][column];

    // Ensure we are in TextMode
    if ('cursorPosition' in state.mode) {
        const cursorPosition = state.mode.cursorPosition;
        let newFormula = cell.formula;

        if (event.key === "ArrowLeft") {
            // Move cursor left
            if (cursorPosition > 0) {
                setState("mode", { ...state.mode, cursorPosition: cursorPosition - 1 });
            }
        } else if (event.key === "ArrowRight") {
            // Move cursor right
            if (cursorPosition < newFormula.length) {
                setState("mode", { ...state.mode, cursorPosition: cursorPosition + 1 });
            }
        } else if (event.key === "Backspace") {
            // Remove the character before the cursor
            if (cursorPosition > 0) {
                newFormula = newFormula.slice(0, cursorPosition - 1) + newFormula.slice(cursorPosition);
                setState("mode", { ...state.mode, cursorPosition: cursorPosition - 1 });
            }
        } else if (event.key === "Delete") {
            // Remove the character at the cursor
            if (cursorPosition < newFormula.length) {
                newFormula = newFormula.slice(0, cursorPosition) + newFormula.slice(cursorPosition + 1);
            }
        } else if (event.key.length === 1) {
            // Insert the new character at the cursor position
            newFormula = newFormula.slice(0, cursorPosition) + event.key + newFormula.slice(cursorPosition);
            setState("mode", { ...state.mode, cursorPosition: cursorPosition + 1 });
        } else {
            return; // Ignore other keys
        }

        // Update the formula in the state
        setState("cells", row, column, "formula", newFormula);
        UpdateCellFormula(row, column, newFormula);
    }
}
