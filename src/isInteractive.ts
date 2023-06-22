export const clickableRoles = new Set(["button", "link", "menuitem", "switch", "tab"]);

export const checkboxAndRadioRoles = new Set([
    "checkbox",
    "radio",
    "menuitemcheckbox",
    "menuitemradio",
]);

export const isNotDisabled = (element: Element) =>
    !(element as HTMLButtonElement).disabled && element.getAttribute("aria-disabled") !== "true";
