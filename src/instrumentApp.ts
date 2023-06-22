import { getAncestors } from "./getAncestors";
import { getRole } from "./getRole";
import { instrumentClicks, InstrumentClicksParams } from "./instrumentClicks";
import { checkboxAndRadioRoles, clickableRoles, isNotDisabled } from "./isInteractive";

/** Records change events and click events on interactive elements, returns an unsubscribe function */
export const instrumentApp = (params: InstrumentClicksParams): (() => void) => {
    const {
        onInteraction,
        eventCapture = true,
        maxDepth = 6,
        rootElement = document.body,
    } = params;
    if (!params.findInteractive) {
        params = {
            ...params,
            // include clicks on non-native checkboxes, radios, and selects by default since they don't fire change events
            findInteractive: (element) => {
                for (element of getAncestors(element, rootElement, maxDepth)) {
                    if (isNotDisabled(element)) {
                        const role = getRole(element);
                        if (
                            role &&
                            (clickableRoles.has(role) ||
                                (checkboxAndRadioRoles.has(role) && element.localName !== "input"))
                        ) {
                            return element;
                        }
                        // return the listbox when a non-native option is clicked
                        if (role === "option" && element.localName !== "option") {
                            for (element of getAncestors(element, rootElement, maxDepth)) {
                                if (
                                    isNotDisabled(element) &&
                                    getRole(element) === "listbox" &&
                                    element.localName !== "select"
                                ) {
                                    return element;
                                }
                            }
                        }
                    }
                }
            },
        };
    }
    const removeClickListener = instrumentClicks(params);
    const changeListener = (e: Event) => onInteraction(e.target as Element);
    rootElement.addEventListener("change", changeListener, eventCapture);
    return () => {
        removeClickListener();
        rootElement.removeEventListener("change", changeListener, eventCapture);
    };
};
