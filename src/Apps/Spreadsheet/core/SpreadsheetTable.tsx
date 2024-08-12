import { createSignal, createEffect, Component, For, Accessor } from 'solid-js';
import { Spreadsheet, Cell } from './coreTypes';

type Props = {
    data: Spreadsheet;
    selectedCell: { rowIndex: number; colIndex: number } | null;
    onCellSelect: (rowIndex: number, colIndex: number) => void;
    onFormulaChange: (rowIndex: number, colIndex: number, formula: string, oldFormula: string) => void;
};

const SpreadsheetTable: Component<Props> = (props) => {
    const [currentFormula, setCurrentFormula] = createSignal('');
    const [isEditing, setIsEditing] = createSignal<{ rowIndex: number; colIndex: number } | null>(null);

    // Update the formula bar whenever the selected cell changes
    createEffect(() => {
        if (props.selectedCell) {
            const { rowIndex, colIndex } = props.selectedCell;
            const selectedCell = props.data[rowIndex][colIndex];
            setCurrentFormula(selectedCell.formula);
        } else {
            setCurrentFormula('');
        }
    });

    const handleFormulaChange = (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        const oldFormula = currentFormula();
        setCurrentFormula(value);

        if (props.selectedCell) {
            const { rowIndex, colIndex } = props.selectedCell;
            props.onFormulaChange(rowIndex, colIndex, value, oldFormula);
        }
    };

    function RenderCell(cell: Cell, rowIndex: Accessor<number>, colIndex: Accessor<number>): any 
    {
        return (<td>
            <input
                type="text"
                value={
                    isEditing()?.rowIndex === rowIndex() &&
                    isEditing()?.colIndex === colIndex()
                        ? currentFormula()
                        : cell.formulaCachedValue ?? ''
                }
                readOnly={!(isEditing()?.rowIndex === rowIndex() && isEditing()?.colIndex === colIndex())}
                onFocus={() => {
                    props.onCellSelect(rowIndex(), colIndex());
                    setIsEditing({ rowIndex: rowIndex(), colIndex: colIndex() });
                }}
                onBlur={(e) => {
                    handleFormulaChange(e); // focus lost workaround
                    setIsEditing(null);
                }}
                // onInput={handleFormulaChange} Input loses focus after key pressed
            />
        </td>);
    }

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
                                    {(cell, colIndex) => RenderCell(cell,rowIndex,colIndex) }
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
