import { getAncestors } from "./getAncestors";
import { getRole } from "./getRole";
import { instrumentChanges } from "./instrumentChanges";
import { instrumentClicks, InstrumentClicksParams } from "./instrumentClicks";
import {
    checkboxAndRadioRoles,
    clickableRoles,
    isNotDisabled,
} from "./isInteractive";

export type InstrumentAppParams = InstrumentClicksParams;

/** Records change events and click events on interactive elements, returns an unsubscribe function */
export const instrumentApp = (params: InstrumentAppParams) => {
    if (!params.findInteractive) {
        const { maxDepth = 6, rootElement = document.body } = params;
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
                                (checkboxAndRadioRoles.has(role) &&
                                    element.localName !== "input"))
                        ) {
                            return element;
                        }
                        // return the listbox when a non-native option is clicked
                        if (
                            role === "option" &&
                            element.localName !== "option"
                        ) {
                            for (element of getAncestors(
                                element,
                                rootElement,
                                maxDepth
                            )) {
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
    const removePointerListener = instrumentClicks(params);
    const removeChangeListener = instrumentChanges(params);
    return () => {
        removePointerListener();
        removeChangeListener();
    };
};
