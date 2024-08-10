import { Component, For, createEffect, createSignal } from 'solid-js';
import { Spreadsheet } from './coreTypes';

type Props = {
    data: Spreadsheet;
    selectedCell: { rowIndex: number; colIndex: number } | null;
    onCellSelect: (rowIndex: number, colIndex: number) => void;
    onFormulaChange: (rowIndex: number, colIndex: number, formula: string) => void;
};

const SpreadsheetTable: Component<Props> = (props) => {
    const [currentFormula, setCurrentFormula] = createSignal('');

    createEffect(() => {
        if (props.selectedCell) {
            const { rowIndex, colIndex } = props.selectedCell;
            const selectedCell = props.data[rowIndex][colIndex];
            setCurrentFormula(selectedCell.formula);
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
                                                onInput={(e) =>
                                                    props.onFormulaChange(rowIndex(), colIndex(), e.currentTarget.value)
                                                }
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
