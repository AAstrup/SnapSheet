import { Component, createSignal } from 'solid-js';
import SpreadsheetTable from './core/SpreadsheetTable';
import { Spreadsheet } from './core/coreTypes';
import { handleFormulaChange } from './core/formulaUtils';

const App: Component = () => {
    const initialData: Spreadsheet = [
        [{ formula: 'A1', formulaCachedValue: 'A1' }, { formula: 'B1', formulaCachedValue: 'B1' },],
        [{ formula: 'A2', formulaCachedValue: 'A2' }, { formula: 'B2', formulaCachedValue: 'B2' },]
    ];

    const [data, setData] = createSignal<Spreadsheet>(initialData);
    const [selectedCell, setSelectedCell] = createSignal<{ rowIndex: number; colIndex: number } | null>(null);

    return (
        <SpreadsheetTable
            data={data()}
            selectedCell={selectedCell()}
            onCellSelect={(rowIndex, colIndex) => setSelectedCell({ rowIndex, colIndex })}
            onFormulaChange={(rowIndex, colIndex, formula) => 
                handleFormulaChange(data(), rowIndex, colIndex, formula, setData)
            }
        />
    );
};

export default App;
