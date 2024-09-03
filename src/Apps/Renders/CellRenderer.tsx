import { Component, createEffect } from "solid-js";
import { Cell, TextMode } from "../StateManagement/Types";
import { state } from "../StateManagement/Statemanager";
import { handleMouseClick } from "../Handlers/MouseHandler";

interface CellRendererProps {
    cell: Cell;
    row: number;
    col: number;
    isSelected: boolean;
    isReferenced: boolean;
    isTextMode: boolean;
}

const CellRenderer: Component<CellRendererProps> = (props) => {

    
    const handleCellClick = (event: MouseEvent) => {
        handleMouseClick(props.row, props.col,event, props.cell.cachedFormulaValue);
    };

    const getCursorPosition = (fontSize: number) => {
        const cursorPosition = (state.mode as TextMode).cursorPosition;
        const textBeforeCursor = props.cell.formula.slice(0, cursorPosition);
        // Measure the width of the text before the cursor
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre'; // Preserve whitespace
        span.style.fontSize = `${fontSize}px`;
        span.textContent = textBeforeCursor;
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
    };

    const getSelectedText = () => {
        const cursorPosition = (state.mode as TextMode).cursorPosition;
        const cursorSelectionStartPosition = (state.mode as TextMode).cursorSelectionStartPosition;
        const start = Math.min(cursorPosition, cursorSelectionStartPosition);
        const end = Math.max(cursorPosition, cursorSelectionStartPosition);
        
        return {
            beforeSelection: props.cell.formula.slice(0, start),
            selected: props.cell.formula.slice(start, end),
            afterSelection: props.cell.formula.slice(end)
        };
    };
    createEffect(() => {

    },props.cell);
    return (
        <div onMouseDown={handleCellClick} class={`cell ${!props.isReferenced && !props.isSelected ? "w-24 h-24 border-0 border-solid border-gray-600 bg-gray-100" : ""} ${props.isReferenced ? "w-24 h-24 border-2 border-dashed border-indigo-600 bg-indigo-100" : "" } ${props.isSelected && !props.isTextMode ? "w-24 h-24 border-2 border-none border-indigo-600 bg-indigo-100" : "" } ${props.isSelected && props.isTextMode ? "w-24 h-24 border border-solid border-indigo-600 bg-indigo-100" : "" }`} style="position: relative;">
            {props.isSelected && props.isTextMode ? (
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
            ) : 
                (
                    <div class="cell-content">{props.cell.cachedFormulaValue}</div>
                )}
        </div>
    );
};

export default CellRenderer;
