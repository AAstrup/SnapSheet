import { Component, createSignal, createEffect } from "solid-js";
import { Cell, TextMode } from "../StateManagement/Types";
import { state } from "../StateManagement/Statemanager";
import { handleMouseClick } from "../Handlers/MouseHandler";

interface CellRendererProps {
    cell: Cell;
    row: number;
    col: number;
}

const CellRenderer: Component<CellRendererProps> = (props) => {
    const isSelected = () => state.selectedCells.some(
        (cellPosition) => cellPosition.row === props.row && cellPosition.column === props.col
    );

    const isTextMode = () => {
        return (state.mode as TextMode).textMode !== undefined;
    };

    const handleCellClick = () => {
        handleMouseClick(props.row, props.col);
    };

    const getCursorPosition = () => {
        const cursorPosition = (state.mode as TextMode).cursorPosition;
        const textBeforeCursor = props.cell.formula.slice(0, cursorPosition);
        // Measure the width of the text before the cursor
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre'; // Preserve whitespace
        span.textContent = textBeforeCursor;
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
    };

    return (
        <div onClick={handleCellClick} class="cell" style="position: relative;">
            {isSelected() && isTextMode() ? (
                <div class="cell-content" style="position: relative;">
                    {props.cell.formula}
                    <span 
                        class="absolute-cursor" 
                        style={`left: ${getCursorPosition()}px; position: absolute; top: 0;`}
                    ></span>
                </div>
            ) : (
                <div class="bg-green-100">{props.cell.cachedFormulaValue}</div>
            )}
        </div>
    );
};

export default CellRenderer;
