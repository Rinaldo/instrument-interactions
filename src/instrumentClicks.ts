import { createMetric, Metric } from "./createMetric";
import { getAncestors } from "./getAncestors";
import { getRole } from "./getRole";
import { clickableRoles, isNotDisabled } from "./isInteractive";

export interface InstrumentClicksParams {
    /** called whenever a click event is triggered on an interactive element */
    onInteraction: (metric: Metric, element: Element) => void;
    /** find the interactive element, if any, that was clicked on */
    findInteractive?: (element: Element) => Element | undefined;
    /** how far up the tree the default findInteractive function walks up the tree */
    maxDepth?: number;
    /** element to attach the listener to */
    rootElement?: HTMLElement;
    /** whether to add listener(s) with { capture: true }, enabled by default */
    eventCapture?: boolean;
    /** whether to add Space and Enter keyboard listeners to support keyboard 'clicks' on non-native buttons and links, enabled by default */
    keyboardHandlers?: boolean;
}

/** Records click events on interactive elements, returns an unsubscribe function */
export const instrumentClicks = (params: InstrumentClicksParams): (() => void) => {
    const {
        onInteraction,
        maxDepth = 6,
        rootElement = document.body,
        eventCapture = true,
        keyboardHandlers = true,
    } = params;
    if (rootElement) {
        const findInteractive: (element: Element) => Element | undefined =
            params.findInteractive ||
            ((element) => {
                for (element of getAncestors(element, rootElement, maxDepth)) {
                    if (isNotDisabled(element) && clickableRoles.has(getRole(element)!)) {
                        return element;
                    }
                }
            });
        const captureInteraction = (element: Element) => {
            const interactiveElement = findInteractive(element);
            interactiveElement &&
                onInteraction(createMetric(interactiveElement), interactiveElement);
        };
        const clickListener = (e: MouseEvent) => captureInteraction(e.target as Element);
        // support Enter and Space keyboard interaction for non-native controls
        const keyboardListener = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            if (
                activeElement &&
                activeElement.localName !== "input" &&
                activeElement.localName !== "button" &&
                activeElement.localName !== "a" &&
                (e.code === "Enter" || e.code === "Space")
            ) {
                const activeDescendantId = activeElement.getAttribute("aria-activedescendant");
                const activeDescendant =
                    (activeDescendantId && document.getElementById(activeDescendantId)) || null;
                const element = activeDescendant || activeElement;
                captureInteraction(element);
            }
        };
        rootElement.addEventListener("click", clickListener, eventCapture);
        keyboardHandlers && rootElement.addEventListener("keydown", keyboardListener, eventCapture);
        return () => {
            rootElement.removeEventListener("click", clickListener, eventCapture);
            keyboardHandlers &&
                rootElement.removeEventListener("keydown", keyboardListener, eventCapture);
        };
    }
    throw Error("Invalid root element");
};
