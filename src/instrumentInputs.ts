export interface InstrumentInputsParams {
    onInteraction: (element: Element) => void;
    rootElement?: HTMLElement;
    useEventCapture?: boolean;
}

export const instrumentInputs = (
    params: InstrumentInputsParams
): (() => void) => {
    const { onInteraction, useEventCapture = true } = params;

    const rootElement = params.rootElement || document.body;
    if (rootElement) {
        const changeListener = (e: Event) => onInteraction(e.target as Element);
        rootElement.addEventListener("change", changeListener, useEventCapture);

        return () => {
            rootElement.removeEventListener(
                "change",
                changeListener,
                useEventCapture
            );
        };
    }
    throw Error("Invalid root element");
};
