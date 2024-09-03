import { Component, createEffect, createSignal } from "solid-js";
import { Cell, getCellPositionKey, getKeyCellPosition, MarkMode, ReferencedCells, SelectedCells, TextMode } from "../StateManagement/Types";
import { state } from "../StateManagement/Statemanager";
import { handleMouseClick } from "../Handlers/MouseHandler";

interface CellRendererProps {
    cell: Cell;
    row: number;
    col: number;
    selectedCells: SelectedCells
    referencedCells: ReferencedCells
    mode: MarkMode | TextMode,
    cells: Cell[][],
}

const CellRenderer: Component<CellRendererProps> = (props) => {
    const [cell, setCell] = createSignal(props.cell);
    const [isReferenced, setIsReferenced] = createSignal(false);
    const [isSelected, setIsSelected] = createSignal(false);
    const [textMode, setTextMode] = createSignal<TextMode|undefined>(undefined);
    const [isTextMode, setIsTextMode] = createSignal(false);

    createEffect(() => {
        // This will ensure reactivity
        console.log(`Rendering cell at row ${props.row}, col ${props.col}`);
        // React to specific cell changes
        const positionsAsKey = getCellPositionKey(props.row, props.col);
        setIsSelected(props.selectedCells[positionsAsKey]);
        setIsReferenced(props.referencedCells[positionsAsKey]);
        setTextMode(props.mode as TextMode);
        setIsTextMode((props.mode as TextMode).textMode !== undefined);
        setCell(props.cells[props.row][props.col]);
    });

    const handleCellClick = (event: MouseEvent) => {
        handleMouseClick(props.row, props.col, event, cell().cachedFormulaValue);
    };

    const getCursorPosition = (fontSize: number) => {
        const cursorPosition = textMode()!.cursorPosition;
        const textBeforeCursor = cell().formula.slice(0, cursorPosition);
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre';
        span.style.fontSize = `${fontSize}px`;
        span.textContent = textBeforeCursor;
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
    };

    const getSelectedText = () => {
        const cursorPosition = textMode()!.cursorPosition;
        const cursorSelectionStartPosition = textMode()!.cursorSelectionStartPosition;
        const start = Math.min(cursorPosition, cursorSelectionStartPosition);
        const end = Math.max(cursorPosition, cursorSelectionStartPosition);
        
        return {
            beforeSelection: cell().formula.slice(0, start),
            selected: cell().formula.slice(start, end),
            afterSelection: cell().formula.slice(end)
        };
    };

    return (
        <div onMouseDown={handleCellClick} class={`cell ${!isReferenced() && !isSelected() ? "w-24 h-24 border-0 border-solid border-gray-600 bg-gray-100" : ""} ${isReferenced() ? "w-24 h-24 border-2 border-dashed border-indigo-600 bg-indigo-100" : ""} ${isSelected() && !isTextMode() ? "w-24 h-24 border-2 border-none border-indigo-600 bg-indigo-100" : ""} ${isSelected() && isTextMode() ? "w-24 h-24 border border-solid border-indigo-600 bg-indigo-100" : "" }`} style="position: relative;">
            {isSelected() && isTextMode() ? (
                <div class="cell-content" style="position: relative;">
                    {(() => {
                        const { beforeSelection, selected, afterSelection } = getSelectedText();
                        return (
                            <>
                                <span class="editable-text">{beforeSelection}</span>
                                <span class="selected-text editable-text">{selected}</span>
                                <span 
                                    class="absolute-cursor" 
                                    style={`left: ${getCursorPosition(12)}px; position: absolute; top: 0; transform: translateY(0.2em);`}
                                ></span>
                                <span class="editable-text">{afterSelection}</span>
                            </>
                        );
                    })()}
                </div>
            ) : (
                <div class="cell-content">{cell().cachedFormulaValue}</div>
            )}
        </div>
    );
};

export default CellRenderer;
