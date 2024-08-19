export function calculateMouseCharPosition(event: MouseEvent): number {
    let targetElement = event.target as HTMLElement;

    // Traverse up the DOM tree to find the cell container
    while (targetElement && !targetElement.classList.contains('cell')) {
        targetElement = targetElement.parentElement as HTMLElement;
    }

    if (!targetElement) {
        return 0; // If no cell container is found, return default cursor position
    }

    const cellElement = targetElement;
    let cursorPosition = 0;
    let accumulatedWidth = 0;

    // Recursively calculate cursor position by traversing child nodes
    function traverseNodes(node: ChildNode): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent || "";

            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            document.body.appendChild(span);

            for (let i = 0; i < textContent.length; i++) {
                span.textContent = textContent[i];
                const charWidth = span.getBoundingClientRect().width;

                accumulatedWidth += charWidth / 2;

                if (accumulatedWidth >= event.clientX - cellElement.getBoundingClientRect().left) {
                    cursorPosition += i;
                    document.body.removeChild(span);
                    return true; // Stop traversing, position found
                }

                accumulatedWidth += charWidth / 2;
            }

            cursorPosition += textContent.length;
            document.body.removeChild(span);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const childNodes = Array.from(node.childNodes);
            for (let child of childNodes) {
                if (traverseNodes(child)) {
                    return true; // Stop traversing if position found
                }
            }
        }
        return false; // Continue traversing
    }

    traverseNodes(cellElement);

    return cursorPosition;
}