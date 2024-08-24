import { setState } from "../StateManagement/Statemanager";
import { CellPosition, ViewPort } from "../StateManagement/Types";

export const getViewportSize = () => {
    // Estimate the number of rows and columns that can fit in the viewport
    const rowHeight = 30; // Approximate height of each row in pixels
    const colWidth = 100; // Approximate width of each column in pixels
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    return {
        rowsInScreen: Math.floor(viewportHeight / rowHeight),
        columnInScreen: Math.floor(viewportWidth / colWidth)
    }
};