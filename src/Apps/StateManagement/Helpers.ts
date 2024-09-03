import { Cell, getKeyCellPosition, Spreadsheet } from "./Types";

export interface firstCell{
    cell: Cell,
    row: number,
    column: number
}

export const getFirstCell = (state: Spreadsheet): firstCell | null => {
    debugger
    let cell : Cell | null = null;
    Object.keys(state.selectedCells).forEach(cellKey => {
        const cellPosition = getKeyCellPosition(cellKey);
        cell = state.cells[cellPosition.row][cellPosition.column];
        return;
    });
    return cell;
}
