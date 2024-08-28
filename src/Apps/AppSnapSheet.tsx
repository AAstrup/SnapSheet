import { Component, onMount } from "solid-js";
import SpreadSheetRenderer from "./Renders/SpreadSheetRenderer";
import { handleKeyPress } from "./Handlers/KeyPressHandler";

const App: Component = () => {
    onMount(() => {
        document.addEventListener("keydown", handleKeyPress);
    });
    
    return (
        <>  
            <SpreadSheetRenderer />
        </>
    );
};

export default App;
