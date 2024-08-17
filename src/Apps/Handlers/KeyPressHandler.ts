// Handlers/KeyPressHandler.ts
import { state, setState, UpdateCellFormula } from "../StateManagement/Statemanager";

export function handleKeyPress(event: KeyboardEvent) {
    debugger

    const selectedCell = state.selectedCells[0]; // Assuming a single cell selection

    if (!selectedCell) return; // No cell selected

    const { row, column } = selectedCell;
    const cell = state.cells[row][column];

    let newFormula = cell.formula;

    if (event.key === "Backspace") {
        // Remove the last character
        newFormula = newFormula.slice(0, -1);
    } else if (event.key === "Delete") {
        // Clear the formula
        newFormula = "";
    } else if (event.key.length === 1) {
        // Add the new character to the formula
        newFormula += event.key;
    } else {
        return; // Ignore other keys
    }

    // Update the formula in the state
    setState("cells", row, column, "formula", newFormula);
    UpdateCellFormula(row, column, newFormula);
}
