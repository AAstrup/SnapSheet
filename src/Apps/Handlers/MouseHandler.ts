// Handlers/MouseHandler.ts
import { selectCell, setState, state } from "../StateManagement/Statemanager";
import { TextMode } from "../StateManagement/Types";

let mouseDown = false; // Flag to track if mouse button is pressed
let lastMouseClick = new Date().getTime();
const doubleClickTime = 500;

export function handleMouseClick(row: number, col: number, event: MouseEvent, cachedFormulaValue: string | number): void {
    let currentTime = new Date().getTime();
    console.log("currentTime - lastMouseClick", currentTime - lastMouseClick)
    if(currentTime - lastMouseClick < doubleClickTime)
        handleMouseDoubleClick(row, col, cachedFormulaValue)
    else
        handleMouseSingleClick(row,col, event);
    lastMouseClick = currentTime;
    mouseDown = true; // Set the flag to true when mouse button is pressed
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseSingleClick(row: number, col: number, event: MouseEvent): void {
    const cursorPosition = calculateMouseCharPosition(event);

    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: cursorPosition, 
        cursorSelectionStartPosition: cursorPosition 
    } as TextMode);
    console.log("handleMouseClick, cursorPosition", cursorPosition)
}

function handleMouseDoubleClick(row: number, col: number, cachedFormulaValue: string | number): void {
    const cursorPosition = cachedFormulaValue.toString().length;

    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: cachedFormulaValue.toString().length, 
        cursorSelectionStartPosition: 0 
    } as TextMode);

    console.log("handleMouseDoubleClick, cursorPosition", cursorPosition)
}

function calculateMouseCharPosition(event: MouseEvent): number {
    let targetElement = event.target as HTMLElement;

    // Traverse up the DOM tree to find the cell container
    while (targetElement && !targetElement.classList.contains('cell')) {
        targetElement = targetElement.parentElement as HTMLElement;
    }

    if (!targetElement) {
        return 0; // If no cell container is found, return default cursor position
    }

    const cellElement = targetElement;
    let cursorPosition = 0;
    let accumulatedWidth = 0;

    // Recursively calculate cursor position by traversing child nodes
    function traverseNodes(node: ChildNode): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent || "";

            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            document.body.appendChild(span);

            for (let i = 0; i < textContent.length; i++) {
                span.textContent = textContent[i];
                const charWidth = span.getBoundingClientRect().width;

                accumulatedWidth += charWidth / 2;

                if (accumulatedWidth >= event.clientX - cellElement.getBoundingClientRect().left) {
                    cursorPosition += i;
                    document.body.removeChild(span);
                    return true; // Stop traversing, position found
                }

                accumulatedWidth += charWidth / 2;
            }

            cursorPosition += textContent.length;
            document.body.removeChild(span);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const childNodes = Array.from(node.childNodes);
            for (let child of childNodes) {
                if (traverseNodes(child)) {
                    return true; // Stop traversing if position found
                }
            }
        }
        return false; // Continue traversing
    }

    traverseNodes(cellElement);

    return cursorPosition;
}


function handleMouseMove(event: MouseEvent): void {
    if (!mouseDown) return; // Only process mouse move if the mouse button is pressed

    const cursorPosition = calculateMouseCharPosition(event);
    
    console.log("handleMouseMove, cursorPosition", cursorPosition)
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
