import { sumFunction } from "./sumFunction";

interface FunctionCollection {   
    [functionToken: string]: (cachedFormulaValue:(string|number)[]) => (string|number);
}
export const functionCollection : FunctionCollection = {
    "SUM" : sumFunction,
}

