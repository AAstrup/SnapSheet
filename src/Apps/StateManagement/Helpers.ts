import { Cell, Spreadsheet } from "./Types";

export interface firstCell{
    cell: Cell,
    row: number,
    column: number
}

export const getFirstCell = (state: Spreadsheet): firstCell | null => {
    state.selectedCells.getAll().forEach(cell => {
        return state.cells[cell.row][cell.column];
    });
    return null;
}
