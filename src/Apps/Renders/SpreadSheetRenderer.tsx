import { Component, For } from "solid-js";
import { state } from "../StateManagement/Statemanager";
import CellRenderer from "./CellRenderer";

const SpreadSheetRenderer: Component = () => {
    return (
        <table>
            <tbody>
                <For each={state.cells}>
                    {(row, rowIndex) => (
                        <tr>
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
