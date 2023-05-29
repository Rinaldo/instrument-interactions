export function* getAncestors(
    element: Element | null,
    rootElement = document.body as Element
) {
    if (rootElement) {
        while (element && element !== rootElement) {
            yield element;
            element = element.parentElement;
        }
        if (element === rootElement) {
            yield element;
        }
    }
}
