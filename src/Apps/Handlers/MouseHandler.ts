// Handlers/MouseHandler.ts
import { selectCell, setState, state } from "../StateManagement/Statemanager";
import { TextMode } from "../StateManagement/Types";
import { calculateMouseCharPosition } from "./MouseHelper";
import { findWordBoundaries } from "./TextHelper";

let mouseDown = false; // Flag to track if mouse button is pressed
let lastMouseClick = new Date().getTime();
const doubleClickTime = 500;
let clickCount = 0;

export function handleMouseClick(row: number, col: number, event: MouseEvent, cachedFormulaValue: string | number): void {
    let currentTime = new Date().getTime();
    if(currentTime - lastMouseClick < doubleClickTime)
        if(clickCount == 2)
            handleMouseTripleClick(row, col, cachedFormulaValue)
        else        
            handleMouseDoubleClick(row, col, event, cachedFormulaValue)
    else
        handleMouseSingleClick(row,col, event);
    lastMouseClick = currentTime;
    mouseDown = true; // Set the flag to true when mouse button is pressed
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseSingleClick(row: number, col: number, event: MouseEvent): void {
    clickCount = 1;
    const cursorPosition = calculateMouseCharPosition(event, 12);

    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: cursorPosition, 
        cursorSelectionStartPosition: cursorPosition 
    } as TextMode);
}

function handleMouseDoubleClick(row: number, col: number, event: MouseEvent, cachedFormulaValue: string | number): void {
    clickCount = 2;
    const result = findWordBoundaries(cachedFormulaValue.toString(), calculateMouseCharPosition(event, 12))
    if(!result)
        return;

    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: result.end, 
        cursorSelectionStartPosition: result.start 
    } as TextMode);
}

function handleMouseTripleClick(row: number, col: number, cachedFormulaValue: string | number): void {
    clickCount = 3;

    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: cachedFormulaValue.toString().length, 
        cursorSelectionStartPosition: 0 
    } as TextMode);
}

function handleMouseMove(event: MouseEvent): void {
    if (!mouseDown) return; // Only process mouse move if the mouse button is pressed

    const cursorPosition = calculateMouseCharPosition(event, 12);
    
    setState("mode", (prevMode) => {
        if ("textMode" in prevMode && prevMode.cursorPosition !== cursorPosition) {
            return { 
                textMode: true, 
                cursorPosition: cursorPosition, 
                cursorSelectionStartPosition: (prevMode as TextMode).cursorSelectionStartPosition 
            } as TextMode;
        }
        return prevMode;
    });
}

function handleMouseUp(): void {
    mouseDown = false; // Reset the flag when the mouse button is released
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
}
