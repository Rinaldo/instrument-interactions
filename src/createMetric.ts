import { getRole } from "./getRole";
import { getAccessibleName } from "./getAccessibleName";

export interface Metric {
    label: string;
    role?: string | undefined;
}

export const createMetric = (element: Element): Metric => ({
    label: getAccessibleName(element),
    role: getRole(element),
});
