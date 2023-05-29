const interactiveRoles = new Set([
    "button",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "tab",
]);
const inputButtons = new Set(["button", "image", "reset", "submit"]);

export const isMetricElement = (element: Element) => {
    if (
        !(element as HTMLButtonElement).disabled &&
        element.getAttribute("aria-disabled") !== "true"
    ) {
        const nodeName = element.nodeName;
        const role = element.getAttribute("role");
        if (nodeName === "A" || nodeName === "AREA" || role === "link") {
            return !!(element as HTMLLinkElement).href;
        }
        return (
            nodeName === "BUTTON" ||
            (role && nodeName !== "OPTION" && interactiveRoles.has(role)) || // record clicks on non-native option elements for compatibility with fancy select widgets but don't record clicks on native option elements as their parent select fires change events
            (nodeName === "INPUT" &&
                inputButtons.has((element as HTMLInputElement).type)) ||
            (nodeName !== "INPUT" &&
                (role === "checkbox" || role === "radio")) || // record clicks on non-native checkboxes and radios since they don't fire change events
            ((role === "gridcell" || role === "treeitem") &&
                (element.hasAttribute("aria-expanded") ||
                    element.hasAttribute("aria-selected")))
        );
    }
    return false;
};
