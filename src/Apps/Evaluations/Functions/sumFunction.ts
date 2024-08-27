export const sumFunction = (cachedFormulaValue: (string | number)[]): number => {
    return cachedFormulaValue
        .map(v => typeof v === 'number' ? v : parseFloat(v))
        .reduce((sum, acc) => sum + (isNaN(acc) ? 0 : acc), 0);
}
