import { Component, createSignal } from 'solid-js';
import SpreadsheetTable from './core/SpreadsheetTable';
import { Spreadsheet } from './core/coreTypes';
import { handleFormulaChange, DependencyMap } from './core/formulaUtils';

const App: Component = () => {
    const initialData: Spreadsheet = [
        [{ formula: '10', formulaCachedValue: 10 }, { formula: '20', formulaCachedValue: 20 }, { formula: '=A1 + B1', formulaCachedValue: 30 }],
        [{ formula: '5', formulaCachedValue: 5 }, { formula: '=A1 * A2', formulaCachedValue: 50 }, { formula: '=B1 - A2', formulaCachedValue: 15 }],
        [{ formula: '=C1 + C2', formulaCachedValue: 45 }, { formula: '=A3 / 2', formulaCachedValue: 22.5 }, { formula: '100', formulaCachedValue: 100 }],
    ];

    const [data, setData] = createSignal<Spreadsheet>(initialData);
    const [selectedCell, setSelectedCell] = createSignal<{ rowIndex: number; colIndex: number } | null>(null);
    const dependencyMap: DependencyMap = {};

    return (
        <SpreadsheetTable
            data={data()}
            selectedCell={selectedCell()}
            onCellSelect={(rowIndex: number, colIndex: number) => setSelectedCell({ rowIndex, colIndex })}
            onFormulaChange={(rowIndex: number, colIndex: number, formula: string) => 
                handleFormulaChange(data(), rowIndex, colIndex, formula, setData, dependencyMap)
            }
        />
    );
};

export default App;
