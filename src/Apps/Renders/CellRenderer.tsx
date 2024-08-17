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

    // Make this part reactive
    const isSelected = () => state.selectedCells.some(
        (cellPosition) => cellPosition.row === props.row && cellPosition.column === props.col
    );

    const isTextMode = () => {
        return (state.mode as TextMode).textMode !== undefined;
    };

    const handleCellClick = () => {
        handleMouseClick(props.row, props.col);
    };


    return (
        <div>
            {isSelected() && isTextMode() ? (
                <div>{props.cell.cachedFormulaValue}</div>
                // <input
                //     type="text"
                //     value={inputValue()}
                //     onInput={handleInputChange}
                //     onBlur={handleBlur}
                //     onKeyDown={handleKeyDown}
                //     autofocus
                // />
            ) : (
                <div onClick={handleCellClick}>{props.cell.cachedFormulaValue}</div>
            )}
        </div>
    );
};

export default CellRenderer;
