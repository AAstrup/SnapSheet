import { Cell } from "./Types";

export class SelectedCells {
    private selected: Set<string> = new Set();
    private referenced: Set<string> = new Set();

    updateAllReferenced(cells: Cell[][]): void {
        this.referenced = new Set();
        this.getAll()
            .map(value => cells[value.row][value.column].cachedFormulaReferencedCells
                .forEach(referencedCell => this.referenced.add(this.getKey(referencedCell.row, referencedCell.column))));
    };

    // Set a cell as selected
    set(row: number, column: number): void {
        const key = this.getKey(row, column);
        this.selected.add(key);
    }

    // Lookup if a cell is selected
    lookup(row: number, column: number): boolean {
        const key = this.getKey(row, column);
        return this.selected.has(key);
    }

    lookupReferenced(row: number, column: number): boolean {
        const key = this.getKey(row, column);
        return this.referenced.has(key);
    }

    // Get all selected cells as an array of row and column pairs
    getAll(): Array<{ row: number, column: number }> {
        const cells: Array<{ row: number, column: number }> = [];
        this.selected.forEach(key => {
            const [row, column] = key.split(',').map(Number);
            cells.push({ row, column });
        });
        return cells;
    }

    // Helper method to create a unique key for each cell
    private getKey(row: number, column: number): string {
        return `${row},${column}`;
    }
}