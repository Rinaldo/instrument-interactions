export const getAriaLabel = (element: Element): string => {
    let label = "";
    const labelledby = element.getAttribute("aria-labelledby");
    if (labelledby) {
        let ids = labelledby.replace(/\s+/, " ").trim().split(" ");
        if (ids.length > 1) {
            // remove duplicate ids per spec
            ids = Array.from(new Set(ids));
        }
        label = ids.reduce((fullLabel, id) => {
            const labelElement = document.getElementById(id);
            if (labelElement) {
                const label = (
                    labelElement.getAttribute("aria-label") ||
                    labelElement.innerText ||
                    (labelElement as HTMLInputElement).value ||
                    ""
                ).trim();
                if (label) {
                    return fullLabel ? fullLabel + " " + label : label;
                }
            }
            return fullLabel;
        }, "");
    }
    return label || element.getAttribute("aria-label") || "";
};

/** Returns the element's accessible name */
export const getAccessibleName = (element: Element): string => {
    let label = getAriaLabel(element);
    if (!label && "labels" in element) {
        (element as HTMLInputElement).labels?.forEach((labelElement) => {
            label += labelElement.innerText + " ";
        });
        label = label.trim();
    }
    if (!label) {
        label =
            (element as HTMLImageElement).alt ||
            (element as HTMLElement).innerText ||
            (element as HTMLInputElement).value ||
            (element as HTMLElement).title ||
            "";
        label = label.trim();
    }
    if (!label && element.childElementCount) {
        // support links containing accessible images and svgs
        element.querySelectorAll("title,img[alt]").forEach((element) => {
            label +=
                ((element.localName === "title"
                    ? element.textContent?.trim()
                    : (element as HTMLImageElement).alt) || "") + " ";
        });
        label = label.trim();
    }

    return label;
};
