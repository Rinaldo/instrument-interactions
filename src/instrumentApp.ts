import { instrumentInputs } from "./instrumentInputs";
import {
    instrumentPointer,
    InstrumentPointerParams,
} from "./instrumentPointer";

export type InstrumentParams = InstrumentPointerParams;

export const instrumentApp = (params: InstrumentParams) => {
    const removePointerListener = instrumentPointer(params);
    const removeChangeListener = instrumentInputs(params);
    return () => {
        removePointerListener();
        removeChangeListener();
    };
};
