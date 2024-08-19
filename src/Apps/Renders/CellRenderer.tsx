import { Component } from "solid-js";
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

    const handleCellClick = (event: MouseEvent) => {
        handleMouseClick(props.row, props.col,event, props.cell.cachedFormulaValue);
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

    return (
        <div onMouseDown={handleCellClick} class="cell no-select" style="position: relative;">
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
                                    style={`left: ${getCursorPosition()}px; position: absolute; top: 0; transform: translateY(0.2em);`}
                                ></span>
                                <span class="editable-text">{afterSelection}</span>
                            </>
                        );
                    })()}
                </div>
            ) : (
                <div class="cell-content">{props.cell.cachedFormulaValue}</div>
            )}
        </div>
    );
};

export default CellRenderer;
