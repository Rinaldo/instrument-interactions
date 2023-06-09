/** Returns the element's role. Implicit roles are only supported for interactive elements */
export const getRole = (element: Element): string | undefined => {
    const explicitRole = element.getAttribute("role");
    if (explicitRole) {
        return explicitRole;
    }
    const localName = element.localName;
    switch (localName) {
        case "button":
        case "option":
            return localName;
        case "a":
        case "area":
            return (element as HTMLAnchorElement).href ? "link" : undefined;
        case "input":
            switch ((element as HTMLInputElement).type) {
                case "button":
                case "image":
                case "reset":
                case "submit":
                    return "button";
                case "checkbox":
                case "radio":
                    return (element as HTMLInputElement).type;
                case "range":
                    return "slider";
                case "email":
                case "tel":
                case "text":
                case "url":
                    return element.hasAttribute("list")
                        ? "combobox"
                        : "textbox";
                case "search":
                    return element.hasAttribute("list")
                        ? "combobox"
                        : "searchbox";
                case "number":
                    return "spinbutton";
                default:
                    return undefined;
            }
        case "select":
            return element.hasAttribute("multiple") ||
                (element as HTMLSelectElement).size > 1
                ? "listbox"
                : "combobox";
        case "textarea":
            return "textbox";
    }
};
