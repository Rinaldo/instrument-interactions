import { isClickableElement as defaultIsClickable } from "./isClickableElement";
import { getAncestors } from "./getAncestors";
import { instrumentChangesParams } from "./instrumentChanges";

export interface instrumentClicksParams extends instrumentChangesParams {
    isClickableElement?: (element: Element) => unknown;
    maxDepth?: number;
}

export const instrumentClicks = (
    params: instrumentClicksParams
): (() => void) => {
    const {
        isClickableElement = defaultIsClickable,
        maxDepth = 6,
        onInteraction,
        useEventCapture = true,
    } = params;
    let pending: Element | null = null; // dedupe click and keyboard events for same element, see below
    const rootElement = params.rootElement || document.body;
    if (rootElement) {
        const captureInteraction = (element: Element) => {
            let i = 0;
            for (element of getAncestors(element, rootElement)) {
                if (maxDepth > -1 && maxDepth <= i++) {
                    return;
                }
                if (isClickableElement(element)) {
                    onInteraction(element);
                    return;
                }
            }
        };
        const clickListener = (e: MouseEvent) => {
            if (e.target !== pending) {
                captureInteraction(e.target as Element);
            }
        };
        // support Enter and Space keyboard interaction
        const keyboardListener = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            if (activeElement && (e.code === "Enter" || e.code === "Space")) {
                const activeDescendantId = activeElement.getAttribute(
                    "aria-activedescendant"
                );
                const activeDescendant =
                    (activeDescendantId &&
                        document.getElementById(activeDescendantId)) ||
                    null;
                const element = activeDescendant || activeElement;
                captureInteraction(element);
                // avoid capturing duplicate click and keydown metrics on key press
                pending = element;
                requestAnimationFrame(() => {
                    pending = null;
                });
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
