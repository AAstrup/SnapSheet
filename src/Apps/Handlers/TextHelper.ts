export function findWordBoundaries(text: string, position: number): { start: number, end: number } | null {
    if (position < 0 || position >= text.length) {
        return null;
    }

    let start = position;
    let end = position;

    // Expand start to the left until a non-word character is found
    while (start > 0 && /\w/.test(text[start - 1])) {
        start--;
    }

    // Expand end to the right until a non-word character is found
    while (end < text.length && /\w/.test(text[end])) {
        end++;
    }

    return { start, end };
}
