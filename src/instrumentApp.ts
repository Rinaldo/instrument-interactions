import { instrumentChanges } from "./instrumentChanges";
import { instrumentClicks, instrumentClicksParams } from "./instrumentClicks";

export type InstrumentAppParams = instrumentClicksParams;

export const instrumentApp = (params: InstrumentAppParams) => {
    const removePointerListener = instrumentClicks(params);
    const removeChangeListener = instrumentChanges(params);
    return () => {
        removePointerListener();
        removeChangeListener();
    };
};
