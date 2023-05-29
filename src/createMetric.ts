import { getRole } from "./getRole";
import { getLabel } from "./getLabel";

export interface Metric {
    label: string;
    role?: string;
    name?: string;
    type?: string;
    checked?: boolean;
    /** input value or link href */
    value?: string;
}

export const createMetric = (element: Element): Metric => {
    const metric: Metric = {
        label: getLabel(element),
    };
    if ((element as HTMLInputElement).name) {
        metric.name = (element as HTMLInputElement).name;
    }
    if ((element as HTMLInputElement).type) {
        metric.type = (element as HTMLInputElement).type;
    }
    // some elements like select have a value even though hasAttribute returns false
    if (element.hasAttribute("value") || (element as HTMLInputElement).value) {
        metric.value = (element as HTMLInputElement).value;
    } else if ((element as HTMLAnchorElement).href) {
        metric.value = (element as HTMLAnchorElement).href;
    }
    const role = getRole(element);
    if (role) {
        metric.role = role;
    }
    if (role === "checkbox" || role === "menuitemcheckbox") {
        if (element.nodeName === "INPUT") {
            metric.checked = (element as HTMLInputElement).checked;
        } else {
            const ariaChecked = element.getAttribute("aria-checked") as
                | "true"
                | "false"
                | "mixed"
                | null;
            if (ariaChecked) {
                // invert checked to keep clicks on fake checkboxes consistent with changes on real ones
                metric.checked = ariaChecked !== "true";
            }
        }
    }
    return metric;
};
