/** Returns an iterator for the given element's ancestor elements */
export function* getAncestors(
    element: Element,
    rootElement = document.body as Element,
    maxDepth = -1
) {
    if (rootElement) {
        while (element && element !== rootElement && maxDepth--) {
            yield element;
            element = element.parentElement!;
        }
        if (element === rootElement) {
            yield element;
        }
    }
}
