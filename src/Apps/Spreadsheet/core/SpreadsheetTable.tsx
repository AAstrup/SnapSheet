import { createSignal, createEffect, Component, For } from 'solid-js';
import { Spreadsheet, Cell } from './coreTypes';

type Props = {
    data: Spreadsheet;
    selectedCell: { rowIndex: number; colIndex: number } | null;
    onCellSelect: (rowIndex: number, colIndex: number) => void;
    onFormulaChange: (rowIndex: number, colIndex: number, formula: string) => void;
};

const SpreadsheetTable: Component<Props> = (props) => {
    const [currentFormula, setCurrentFormula] = createSignal('');

    // Update the formula bar whenever the selected cell changes
    createEffect(() => {
        if (props.selectedCell) {
            const { rowIndex, colIndex } = props.selectedCell;
            const selectedCell = props.data[rowIndex][colIndex];
            debugger
            setCurrentFormula(selectedCell.formula);
        } else {
            setCurrentFormula('NO FORMULA SELECTED');
        }
    });

    const handleFormulaChange = (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        setCurrentFormula(value);

        if (props.selectedCell) {
            const { rowIndex, colIndex } = props.selectedCell;
            props.onFormulaChange(rowIndex, colIndex, value);
        }
    };

    return (
        <>
            <div>
                <input
                    type="text"
                    value={currentFormula()}
                    onInput={handleFormulaChange}
                    placeholder="Enter formula"
                />
            </div>
            <table>
                <tbody>
                    <For each={props.data}>
                        {(row, rowIndex) => (
                            <tr>
                                <For each={row}>
                                    {(cell, colIndex) => (
                                        <td>
                                            <input
                                                type="text"
                                                value={cell.formulaCachedValue ?? ''}
                                                readOnly
                                                onFocus={() => {
                                                    props.onCellSelect(rowIndex(), colIndex());
                                                }}
                                            />
                                        </td>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </>
    );
};

export default SpreadsheetTable;
