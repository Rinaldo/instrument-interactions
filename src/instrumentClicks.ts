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
    /** add a listener with { capture: true }, enabled by default */
    useEventCapture?: boolean;
}

/** Records click events on interactive elements, returns an unsubscribe function */
export const instrumentClicks = (
    params: InstrumentClicksParams
): (() => void) => {
    const {
        onInteraction,
        maxDepth = 6,
        rootElement = document.body,
        useEventCapture = true,
    } = params;
    if (rootElement) {
        const findInteractive: (element: Element) => Element | undefined =
            params.findInteractive ||
            ((element) => {
                for (element of getAncestors(element, rootElement, maxDepth)) {
                    if (
                        isNotDisabled(element) &&
                        clickableRoles.has(getRole(element)!)
                    ) {
                        return element;
                    }
                }
            });
        const captureInteraction = (element: Element) => {
            const interactiveElement = findInteractive(element);
            interactiveElement &&
                onInteraction(
                    createMetric(interactiveElement),
                    interactiveElement
                );
        };
        const clickListener = (e: MouseEvent) =>
            captureInteraction(e.target as Element);
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
                const activeDescendantId = activeElement.getAttribute(
                    "aria-activedescendant"
                );
                const activeDescendant =
                    (activeDescendantId &&
                        document.getElementById(activeDescendantId)) ||
                    null;
                const element = activeDescendant || activeElement;
                captureInteraction(element);
            }
        };
        rootElement.addEventListener("click", clickListener, useEventCapture);
        rootElement.addEventListener(
            "keydown",
            keyboardListener,
            useEventCapture
        );
        return () => {
            rootElement.removeEventListener(
                "click",
                clickListener,
                useEventCapture
            );
            rootElement.removeEventListener(
                "keydown",
                keyboardListener,
                useEventCapture
            );
        };
    }
    throw Error("Invalid root element");
};
