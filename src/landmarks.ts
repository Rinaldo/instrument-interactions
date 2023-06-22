import { getAriaLabel } from "./getLabel";
import { getAncestors } from "./getAncestors";

export interface Landmark {
    role: string;
    label?: string | undefined;
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
/** remove banner and contentinfo roles under article, complementary, main, navigation, or region roles */
export const removeInvalidLandmarks = (landmarks: Landmark[]): void => {
    if (landmarks.length > 1) {
        let bannerContentinfoIndex = -1;
        for (let i = 0, landmark = landmarks[0]; i < landmarks.length; landmark = landmarks[++i]) {
            if (
                bannerContentinfoIndex === -1 &&
                bannerContentinfoRoles.has(landmark.role as string)
            ) {
                bannerContentinfoIndex = i;
                continue;
            }
            if (bannerContentinfoIndex !== -1 && containerRoles.has(landmark.role as string)) {
                landmarks.splice(bannerContentinfoIndex, 1);
                removeInvalidLandmarks(landmarks);
                break;
            }
        }
    }
};

/** also counts dialogs and named articles as landmarks */
export const getLandmark = (element: Element): Landmark | undefined => {
    const role = element.getAttribute("role") || implicitLandmarkRoleMap.get(element.nodeName);
    if (role && roleSet.has(role)) {
        const label = getAriaLabel(element) || undefined;
        if (label || !rolesThatNeedNames.has(role)) {
            return { role, label };
        }
    }
};

/** Walks up the tree collecting landmarks */
export const getLandmarks = (
    element: Element,
    rootElement?: Element,
    maxDepth?: number
): Landmark[] => {
    const landmarks: Landmark[] = [];
    for (element of getAncestors(element, rootElement, maxDepth)) {
        const landmark = getLandmark(element);
        landmark && landmarks.push(landmark);
    }
    removeInvalidLandmarks(landmarks);
    return landmarks;
};
