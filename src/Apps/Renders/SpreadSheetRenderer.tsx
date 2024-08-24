import { Component, For } from "solid-js";
import { state } from "../StateManagement/Statemanager";
import CellRenderer from "./CellRenderer";

const SpreadSheetRenderer: Component = () => {
    // Generate column headers (A, B, C, ...)
    const columnHeaders = () => {
        const columns = state.cells[0]?.length || 0;
        return Array.from({ length: columns }, (_, i) =>
            String.fromCharCode("A".charCodeAt(0) + i)
        );
    };

    return (
        <table>
            <thead>
                <tr>
                    <th></th> {/* Top-left empty cell */}
                    <For each={columnHeaders()}>
                        {(header) => <th>{header}</th>}
                    </For>
                </tr>
            </thead>
            <tbody>
                <For each={state.cells}>
                    {(row, rowIndex) => (
                        <tr>
                            <td>{rowIndex() + 1}</td> {/* Row header */}
                            <For each={row}>
                                {(cell, colIndex) => (
                                    <td class="tdcell">
                                        <CellRenderer cell={cell} row={rowIndex()} col={colIndex()} />
                                    </td>
                                )}
                            </For>
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    );
};

export default SpreadSheetRenderer;
