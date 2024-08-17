import { Component } from "solid-js";
import { Cell } from "../StateManagement/Types";

interface CellRendererProps {
    cell: Cell;
}

const CellRenderer: Component<CellRendererProps> = (props) => {
    return (
        <div>
            {props.cell.cachedFormulaValue || props.cell.formula}
        </div>
    );
};

export default CellRenderer;
