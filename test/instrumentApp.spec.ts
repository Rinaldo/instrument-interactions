import { getByLabelText, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { createMetric, instrumentApp, withLandmarks } from "../src";
import { bodyContent } from "./test-page";

describe("instrumentApp", () => {
    const user = userEvent.setup();
    const onMetric = jest.fn();

    document.body.innerHTML = bodyContent;

    const unsubscribe = instrumentApp({
        onInteraction: (element) => {
            onMetric(withLandmarks(element, createMetric(element)));
        },
    });
    afterEach(() => {
        onMetric.mockClear();
    });
    afterAll(() => {
        unsubscribe();
    });

    describe("buttons", () => {
        const buttonsSection = within(getByLabelText(document.body, "Buttons"));

        const landmarks = [
            {
                role: "region",
                label: "Buttons",
            },
            {
                role: "main",
            },
        ];

        it("handles simple buttons", async () => {
            await user.click(
                buttonsSection.getByRole("button", {
                    name: "Real Button",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Real Button",
                role: "button",
                landmarks,
            });
        });
    });
});
