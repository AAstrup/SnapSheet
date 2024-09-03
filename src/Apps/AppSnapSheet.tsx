import { Component, onMount } from "solid-js";
import SpreadSheetRenderer from "./Renders/SpreadSheetRenderer";
import { handleKeyPress } from "./Handlers/KeyPressHandler";
import { state } from "./StateManagement/Statemanager";

const App: Component = () => {
    onMount(() => {
        document.addEventListener("keydown", handleKeyPress);
    });
    
    return (
        <>  
            <SpreadSheetRenderer cells={state.cells} viewPort={state.viewPort} selectedCells={state.selectedCells} mode={state.mode} referencedCells={state.referencedCells}/>
        </>
    );
};

export default App;
