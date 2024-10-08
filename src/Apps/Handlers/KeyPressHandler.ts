import { state, setState, UpdateCellFormulaNoEvaluate, deselectCell } from "../StateManagement/Statemanager";
import { MarkMode, TextMode } from "../StateManagement/Types";
import { markModeHandleKeyPress } from "./MarkModeKeyPressHandler";
import { textModeHandleKeyPress } from "./TextModeKeyPressHandler";

export function handleKeyPress(event: KeyboardEvent) {
    if ('textMode' in state.mode) {
        let textMode = (state.mode as TextMode);
        textModeHandleKeyPress(event, textMode);
    }
    else if('markMode' in state.mode) {
        let markMode = (state.mode as MarkMode);
        markModeHandleKeyPress(event, markMode)
    }
}
