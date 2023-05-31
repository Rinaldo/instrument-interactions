import { getRole } from "./getRole";

const clickableRoles = new Set([
    "button",
    "link",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "tab",
]);

export const isClickableElement = (element: Element) => {
    if (
        !(element as HTMLButtonElement).disabled &&
        element.getAttribute("aria-disabled") !== "true"
    ) {
        const role = getRole(element);
        return (
            clickableRoles.has(role as string) ||
            (element.localName !== "option" && role === "option") ||
            (element.localName !== "input" &&
                (role === "checkbox" || role === "radio")) || // record clicks on non-native checkboxes, radios, and selects since they don't fire change events
            ((role === "gridcell" || role === "treeitem") &&
                (element.hasAttribute("aria-expanded") ||
                    element.hasAttribute("aria-selected")))
        );
    }
    return false;
};
