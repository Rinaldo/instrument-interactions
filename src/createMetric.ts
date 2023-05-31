import { getRole } from "./getRole";
import { getLabel } from "./getLabel";

export interface Metric {
    label: string | undefined;
    role: string | undefined;
}

export const createMetric = (element: Element): Metric => ({
    label: getLabel(element),
    role: getRole(element),
});
