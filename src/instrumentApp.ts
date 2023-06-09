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
        params = {
            ...params,
            // include clicks on non-native checkboxes, radios, and selects by default
            findInteractive: (element) => {
                for (element of getAncestors(
                    element,
                    params.rootElement ?? document.body,
                    params.maxDepth ?? 6
                )) {
                    if (isNotDisabled(element)) {
                        const role = getRole(element);
                        if (
                            role &&
                            (clickableRoles.has(role) ||
                                (checkboxAndRadioRoles.has(role) &&
                                    element.localName !== "input") ||
                                (role === "listbox" &&
                                    element.localName !== "select"))
                        ) {
                            return element;
                        }
                    } else return;
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
