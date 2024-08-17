import { createSignal, onCleanup } from "solid-js";
import "./KeyPressDiv.css"; // CSS for blinking cursor and selection

function KeyPressDiv() {
  const [text, setText] = createSignal<string>("");
  const [cursorPosition, setCursorPosition] = createSignal<number>(0);
  const [selectionEnd, setSelectionEnd] = createSignal<number | null>(null);
  const [isSelecting, setIsSelecting] = createSignal<boolean>(false);

  let divRef: HTMLDivElement | undefined;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      moveCursorLeft(e.shiftKey, e.ctrlKey);
    } else if (e.key === "ArrowRight") {
      moveCursorRight(e.shiftKey, e.ctrlKey);
    } else if (e.key === "Backspace") {
      deletePreviousCharacter();
    } else if (e.key === "Delete") {
      deleteNextCharacter();
    } else if (e.key.length === 1) {
      insertCharacter(e.key);
    }
    e.preventDefault(); // Prevent default behavior of keys.
  };

  const insertCharacter = (key: string) => {
    const currentText = removeCursorMarker(text());
    const position = cursorPosition();
    const selectionRange = selectionEnd();
    let newText: string;
    if (selectionRange !== null && selectionRange !== position) {
      newText =
        currentText.slice(0, Math.min(position, selectionRange)) +
        key +
        currentText.slice(Math.max(position, selectionRange));
      setCursorPosition(Math.min(position, selectionRange) + 1);
    } else {
      newText =
        currentText.slice(0, position) + key + currentText.slice(position);
      setCursorPosition(position + 1);
    }
    setSelectionEnd(null);
    setTextWithCursor(newText, Math.min(position + 1, newText.length));
  };

  const deletePreviousCharacter = () => {
    const currentText = removeCursorMarker(text());
    const position = cursorPosition();
    const selectionRange = selectionEnd();
    let newText: string;

    if (selectionRange !== null && selectionRange !== position) {
      newText =
        currentText.slice(0, Math.min(position, selectionRange)) +
        currentText.slice(Math.max(position, selectionRange));
      setCursorPosition(Math.min(position, selectionRange));
    } else if (position > 0) {
      newText =
        currentText.slice(0, position - 1) + currentText.slice(position);
      setCursorPosition(position - 1);
    } else {
      newText = currentText;
    }

    setSelectionEnd(null);
    setTextWithCursor(newText, Math.min(position - 1, newText.length));
  };

  const deleteNextCharacter = () => {
    const currentText = removeCursorMarker(text());
    const position = cursorPosition();
    const selectionRange = selectionEnd();
    let newText: string;

    if (selectionRange !== null && selectionRange !== position) {
      newText =
        currentText.slice(0, Math.min(position, selectionRange)) +
        currentText.slice(Math.max(position, selectionRange));
      setCursorPosition(Math.min(position, selectionRange));
    } else if (position < currentText.length) {
      newText =
        currentText.slice(0, position) + currentText.slice(position + 1);
    } else {
      newText = currentText;
    }

    setSelectionEnd(null);
    setTextWithCursor(newText, position);
  };

  const moveCursorLeft = (selecting: boolean, ctrlKey: boolean) => {
    let position = cursorPosition();

    checkTracking(selecting, position);

    if (ctrlKey) {
      position = findWordBoundary(position, "left");
    } else {
      position = Math.max(position - 1, 0);
    }

    updateCursorPosition(position, selecting);
  };

  const checkTracking = (selecting: boolean, position: number) => {
    if(selecting && (selectionEnd() === null || selectionEnd() === position)) {
        setSelectionEnd(cursorPosition());
    }
  }

  const moveCursorRight = (selecting: boolean, ctrlKey: boolean) => {
    let position = cursorPosition();
    const currentTextLength = removeCursorMarker(text()).length;

    checkTracking(selecting, position);

    if (ctrlKey) {
      position = findWordBoundary(position, "right");
    } else {
      position = Math.min(position + 1, currentTextLength);
    }

    updateCursorPosition(position, selecting);
  };

  const findWordBoundary = (position: number, direction: "left" | "right"): number => {
    const currentText = removeCursorMarker(text());

    if (direction === "left") {
      while (position > 0 && currentText[position - 1] === " ") {
        position--;
      }
      while (position > 0 && currentText[position - 1] !== " ") {
        position--;
      }
    } else {
      while (position < currentText.length && currentText[position] !== " ") {
        position++;
      }
      while (position < currentText.length && currentText[position] === " ") {
        position++;
      }
    }

    return position;
  };

  const updateCursorPosition = (newPosition: number, selecting: boolean) => {
    if (selecting) {
      setCursorPosition(newPosition);
    } else {
      setCursorPosition(newPosition);
      setSelectionEnd(null);
    }
    setTextWithCursor(removeCursorMarker(text()), newPosition);
    console.log("cursorPosition selectionEnd", cursorPosition(), selectionEnd());
  };

  const handleMouseUp = (e: MouseEvent) => {
    const position = getCursorPosition(e);
    setCursorPosition(position);
    setSelectionEnd(position);
    setIsSelecting(true);
    setTextWithCursor(removeCursorMarker(text()), position);
  };

  const getCursorPosition = (e: MouseEvent): number => {
    const range = window.getSelection()?.getRangeAt(0);
    if (!range || !divRef) return 0;

    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(divRef);
    clonedRange.setEnd(range.endContainer, range.endOffset);
    return clonedRange.toString().length;
  };

  const setTextWithCursor = (newText: string, position: number) => {
    const beforeCursor = newText.slice(0, position);
    const afterCursor = newText.slice(position);
    setText(beforeCursor + "|" + afterCursor);
    setCursorPosition(position);
  };

  const removeCursorMarker = (text: string) => {
    return text.replace("|", "");
  };

  const getSelectionClass = (index: number) => {
    const start = Math.min(cursorPosition(), selectionEnd() || cursorPosition());
    const end = Math.max(cursorPosition(), selectionEnd() || cursorPosition());
    // As the cursor is a character it should not be counted, as of this we offset it
    var cursorOffset = selectionEnd() && cursorPosition() < selectionEnd()! ? 1 : 0;
    return index - cursorOffset >= start && index - cursorOffset < end ? "selected" : "";
  };

  onCleanup(() => {
    window.getSelection()?.removeAllRanges();
  });

  return (
    <div
      ref={(el) => (divRef = el)}
      tabindex="0"
      onKeyDown={handleKeyDown}
      onMouseUp={handleMouseUp}
      style={{
        "white-space": "pre-wrap",
        "word-wrap": "break-word",
        "width": "300px", // Adjust the width as needed
        "border": "1px solid black",
        "padding": "10px",
        "min-height": "50px",
        "outline": "none",
      }}
    >
      {text().split("").map((char, index) => (
        <span
          key={index}
          class={[
            char === "|" ? "cursor" : "",
            getSelectionClass(index),
          ].join(" ")}
          style={char === "|" ? { "background-color": "lightgray" } : {}}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default KeyPressDiv;
