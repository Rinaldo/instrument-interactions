import { createMetric, Metric } from "./createMetric";

export interface InstrumentChangesParams {
    /** called whenever a change event is triggered on an element */
    onInteraction: (metric: Metric, element: Element) => void;
    /** element to attach the listener to */
    rootElement?: HTMLElement;
    /** add a listener with { capture: true }, enabled by default */
    useEventCapture?: boolean;
}

/** Records change events, returns an unsubscribe function */
export const instrumentChanges = (
    params: InstrumentChangesParams
): (() => void) => {
    const { onInteraction, useEventCapture = true } = params;

    const rootElement = params.rootElement || document.body;
    if (rootElement) {
        const changeListener = (e: Event) =>
            onInteraction(
                createMetric(e.target as Element),
                e.target as Element
            );
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
