import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import SpreadsheetTable from './core/SpreadsheetTable';
import { Spreadsheet } from './core/coreTypes';

const App: Component = () => {
    const [data, setData] = createStore<Spreadsheet>([
        [{ formula: 'A1', formulaCachedValue: 'A1' }, { formula: 'B1', formulaCachedValue: 'B1' }],
        [{ formula: 'A2', formulaCachedValue: 'A2' }, { formula: 'B2', formulaCachedValue: 'B2' }]
    ]);

    const [selectedCell, setSelectedCell] = createStore<{ rowIndex: number; colIndex: number }>({ rowIndex: -1, colIndex: -1 });

    const handleFormulaChange = (rowIndex: number, colIndex: number, formula: string) => {
        setData(rowIndex, colIndex, 'formula', formula);
        try {
            setData(rowIndex, colIndex, 'formulaCachedValue', eval(formula));
        } catch {
            setData(rowIndex, colIndex, 'formulaCachedValue', formula);
        }
    };

    return (
        <SpreadsheetTable
            data={data}
            selectedCell={selectedCell}
            onCellSelect={(rowIndex, colIndex) => setSelectedCell({ rowIndex, colIndex })}
            onFormulaChange={handleFormulaChange}
        />
    );
};

export default App;
