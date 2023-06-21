export const clickableRoles = new Set(["button", "link", "menuitem", "switch", "tab"]);

export const checkboxAndRadioRoles = new Set([
    "checkbox",
    "radio",
    "menuitemcheckbox",
    "menuitemradio",
]);

export const isNotDisabled = (element: Element) => element.getAttribute("aria-disabled") !== "true"; // don't need to check actual disabled property since events aren't fired on disabled elements
