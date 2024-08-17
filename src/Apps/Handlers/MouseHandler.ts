// Handlers/MouseHandler.ts
import { selectCell } from "../StateManagement/Statemanager";

export function handleMouseClick(row: number, col: number): void {
    selectCell(row, col);
}
