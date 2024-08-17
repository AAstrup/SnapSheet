import { createStore } from "solid-js/store";
import { Cell, Spreadsheet } from "./Types";

export const [state, setState] = createStore({
    cells: [
        [{ formula: "a" }, { formula: "a" }, { formula: "a" }],
        [{ formula: "a" }, { formula: "a" }, { formula: "a" }],
        [{ formula: "a" }, { formula: "a" }, { formula: "a" }]
      ] as Cell[][]
} as Spreadsheet);