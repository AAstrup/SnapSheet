import { Component, For } from "solid-js";
import { state } from "../StateManagement/State";
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
                                    <td>
                                        <CellRenderer cell={cell} />
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
