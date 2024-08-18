// Handlers/MouseHandler.ts
import { selectCell, setState } from "../StateManagement/Statemanager";
import { TextMode } from "../StateManagement/Types";

export function handleMouseClick(row: number, col: number, event: MouseEvent): void {
    const cursorPosition = calculateMouseCharPosition(event);
    selectCell(row, col);
    setState("mode", { 
        textMode: true, 
        cursorPosition: cursorPosition, 
        cursorSelectionStartPosition: cursorPosition 
    } as TextMode);
}
function calculateMouseCharPosition(event: MouseEvent) : number {
    const cellElement = event.target as HTMLElement;
    const cellText = cellElement.textContent || "";

    // Create a temporary span element to measure text width
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    document.body.appendChild(span);

    let cursorPosition = 0;
    let accumulatedWidth = 0;

    for (let i = 0; i < cellText.length; i++) {
        span.textContent = cellText[i];
        const charWidth = span.getBoundingClientRect().width;
        
        accumulatedWidth += charWidth/2; // only add half size to more easily select to the right of the span

        if (accumulatedWidth >= event.clientX - cellElement.getBoundingClientRect().left) {
            cursorPosition = i;
            break;
        }

        accumulatedWidth += charWidth/2; // only add half size to more easily select to the right of the span

        // If clicked beyond the text, place the cursor at the end
        if (i === cellText.length - 1) {
            cursorPosition = cellText.length;
        }
    }

    document.body.removeChild(span);

    return cursorPosition;
}

