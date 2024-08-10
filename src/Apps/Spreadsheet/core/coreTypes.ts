export type Cell = {
  formulaCachedValue: string | number | null;
  formula: string;
  references?: Cell[];  // List of cells referencing this cell
};

export type Row = Cell[];

export type Spreadsheet = Row[];
