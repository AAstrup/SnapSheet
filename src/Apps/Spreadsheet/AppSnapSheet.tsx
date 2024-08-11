import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import SpreadsheetTable from './core/SpreadsheetTable';
import { Spreadsheet } from './core/coreTypes';
import { handleFormulaChange } from './core/formulaUtils';

const App: Component = () => {
    const [data, setData] = createStore<Spreadsheet>([
        [{ formula: '1', formulaCachedValue: '1', cellsDependingOnCell: [] }, { formula: '2', formulaCachedValue: '2', cellsDependingOnCell: [] }],
        [{ formula: 'A2', formulaCachedValue: 'A2', cellsDependingOnCell: [] }, { formula: 'B2', formulaCachedValue: 'B2', cellsDependingOnCell: [] }]
    ]);

    const [selectedCell, setSelectedCell] = createStore<{ rowIndex: number; colIndex: number }>({ rowIndex: 0, colIndex: 0 });

    return (
        <SpreadsheetTable
            data={data}
            selectedCell={selectedCell}
            onCellSelect={(rowIndex, colIndex) => setSelectedCell({ rowIndex, colIndex })}
            onFormulaChange={(rowIndex: number, colIndex: number, formula: string) => handleFormulaChange(data, rowIndex, colIndex, formula, setData)}
        />
    );
};

export default App;
