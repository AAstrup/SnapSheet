import { SetStoreFunction } from "solid-js/store";
import { Cell, Spreadsheet } from "./Types";

export function UpdateCell(spreadSheet: Spreadsheet, setState: SetStoreFunction<Spreadsheet>, row: number, col: number, newValue: Cell): void {
    if (spreadSheet.cells[row] && spreadSheet.cells[row][col]) {
        setState("cells", row, col, { ...newValue });
    } else {
        console.error("Invalid row or column index");
    }
}