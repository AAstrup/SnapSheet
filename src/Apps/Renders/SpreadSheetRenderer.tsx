import { Component, For, createEffect, createSignal, onMount } from "solid-js";
import { state, setState } from "../StateManagement/Statemanager";
import CellRenderer from "./CellRenderer";
import { getViewportSize } from "./ViewPort";

const SpreadSheetRenderer: Component = () => {
    const updateViewportSize = () => {
        const viewSize = getViewportSize();
        setState("viewPort", {
            rowsInScreen: viewSize.rowsInScreen,
            columnInScreen: viewSize.columnInScreen
        })
    }

    onMount(() => {
        window.addEventListener("resize", updateViewportSize);
    });


    // Generate column headers (A, B, C, ...)
    const columnHeaders = () => {
        const startCol = state.viewPort.viewPortTopLeftShownCell.column;
        const endCol = Math.min(state.cells[0]?.length || 0, startCol + state.viewPort.columnInScreen);
        return Array.from({ length: endCol - startCol }, (_, i) =>
            String.fromCharCode("A".charCodeAt(0) + startCol + i)
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
                <For each={state.cells.slice(state.viewPort.viewPortTopLeftShownCell.row, state.viewPort.viewPortTopLeftShownCell.row + state.viewPort.rowsInScreen)}>
                    {(row, rowIndex) => (
                        <tr>
                            <td class="cellrow">{state.viewPort.viewPortTopLeftShownCell.row + rowIndex() + 1}</td> {/* Row header */}
                            <For each={row.slice(state.viewPort.viewPortTopLeftShownCell.column, state.viewPort.viewPortTopLeftShownCell.column + state.viewPort.columnInScreen)}>
                                {(cell, colIndex) => (
                                    <td class="tdcell">
                                        <CellRenderer
                                            cell={cell}
                                            row={state.viewPort.viewPortTopLeftShownCell.row + rowIndex()}
                                            col={state.viewPort.viewPortTopLeftShownCell.column + colIndex()}
                                        />
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
