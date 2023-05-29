const inputRoleMap = new Map([
    ["checkbox", "checkbox"],
    ["email", "textbox"],
    ["number", "spinbutton"],
    ["radio", "radio"],
    ["range", "slider"],
    ["search", "searchbox"],
    ["tel", "textbox"],
    ["text", "textbox"],
    ["url", "textbox"],
]);
/** returns a subset of roles for clickable elements */
export const getRole = (element: Element): string | undefined => {
    const explicitRole = element.getAttribute("role");
    if (explicitRole) {
        return explicitRole;
    } else if (element.nodeName === "A" || element.nodeName === "AREA") {
        return (element as HTMLAnchorElement).href ? "link" : undefined;
    } else if (element.nodeName === "BUTTON") {
        return "button";
    } else if (element.nodeName === "INPUT") {
        return element.hasAttribute("list")
            ? "combobox"
            : inputRoleMap.get((element as HTMLInputElement).type);
    } else if (element.nodeName === "OPTION") {
        return "option";
    } else if (element.nodeName === "SELECT") {
        return element.hasAttribute("multiple") ||
            (element.getAttribute("size") as any) > 1
            ? "listbox"
            : "combobox";
    } else if (element.nodeName === "TEXTAREA") {
        return "textbox";
    }
};
