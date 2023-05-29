import { getAriaLabel } from "./getLabel";
import { getAncestors } from "./getAncestors";
import { Metric } from "./createMetric";

export interface Landmark {
    role: string;
    label?: string;
}

const implicitLandmarkRoleMap = new Map([
    ["MAIN", "main"], // landmark always
    ["NAV", "navigation"], // landmark always
    ["HEADER", "banner"], // landmark if not under article, complementary, main, navigation, or region
    ["ASIDE", "complementary"], // landmark if not under article, complementary, main, navigation, or region
    ["FOOTER", "contentinfo"], // landmark if not under article, complementary, main, navigation, or region
    ["FORM", "form"], // landmark if named
    ["SECTION", "region"], // landmark if named
    ["ARTICLE", "article"], // not landmark but browsers treat it similarly
    ["DIALOG", "dialog"], // not landmark
]);
const roleSet = new Set([...implicitLandmarkRoleMap.values(), "alertdialog"]);
const rolesThatNeedNames = new Set(["form", "region", "article"]);

const bannerContentinfoRoles = new Set(["banner", "contentinfo"]);
const containerRoles = new Set([
    "article",
    "complementary",
    "main",
    "navigation",
    "region",
    "alertdialog",
    "dialog",
]);
/** remove banner and contentinfo roles under article, complementary, main, navigation, or region */
const removeInvalidLandmarks = (landmarks: Landmark[]): void => {
    if (landmarks.length > 1) {
        let bannerContentinfoIndex = -1;
        for (
            let i = 0, landmark = landmarks[0];
            i < landmarks.length;
            landmark = landmarks[++i]
        ) {
            if (
                bannerContentinfoIndex === -1 &&
                bannerContentinfoRoles.has(landmark.role)
            ) {
                bannerContentinfoIndex = i;
                continue;
            }
            if (
                bannerContentinfoIndex !== -1 &&
                containerRoles.has(landmark.role)
            ) {
                landmarks.splice(bannerContentinfoIndex, 1);
                removeInvalidLandmarks(landmarks);
                break;
            }
        }
    }
};

/** also counts dialogs and named articles as landmarks */
const getLandmark = (element: Element): Landmark | undefined => {
    const role =
        element.getAttribute("role") ||
        implicitLandmarkRoleMap.get(element.nodeName);
    if (role && roleSet.has(role)) {
        const label = getAriaLabel(element);
        if (label) {
            return { role, label };
        } else if (!rolesThatNeedNames.has(role)) {
            return { role };
        }
    }
};

/** mutates the landmarks array, adding a landmark if appropriate and removing landmarks if they are now improperly nested */
export const addLandmark = (
    element: Element,
    landmarks: Landmark[]
): Landmark[] => {
    const landmark = getLandmark(element);
    if (landmark) {
        landmarks.push(landmark);
        removeInvalidLandmarks(landmarks);
    }
    return landmarks;
};

export const withLandmarks = <T extends Metric & { landmarks?: Landmark[] }>(
    element: Element,
    metric: T
): T & { landmarks: Landmark[] } => {
    const landmarks: Landmark[] = [];
    for (element of getAncestors(element)) {
        addLandmark(element, landmarks);
    }
    metric.landmarks = landmarks;
    return metric as T & { landmarks: Landmark[] };
};
