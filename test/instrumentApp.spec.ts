import { getByLabelText, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { instrumentApp, withLandmarks } from "../src";
import { bodyContent } from "./test-page";

describe("instrumentApp", () => {
    const user = userEvent.setup();
    const onMetric = jest.fn();

    document.body.innerHTML = bodyContent;

    const unsubscribe = instrumentApp({
        onInteraction: (metric, element) => {
            onMetric(withLandmarks(metric, element));
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

        it("handles fancy buttons", async () => {
            await user.click(
                within(
                    buttonsSection.getByRole("button", {
                        name: "Fancy Button",
                    })
                ).getByText("Fancy")
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Fancy Button",
                role: "button",
                landmarks,
            });
        });
    });

    describe("fake inputs", () => {
        const fakeInputsSection = within(
            getByLabelText(document.body, "Fake Inputs")
        );

        const landmarks = [
            {
                role: "region",
                label: "Fake Inputs",
            },
            {
                role: "region",
                label: "Inputs",
            },
            {
                role: "main",
            },
        ];

        it("handles fake checkboxes with default isClickable", async () => {
            await user.click(
                fakeInputsSection.getByRole("checkbox", {
                    name: "Remember my preferences",
                })
            );
            expect(onMetric).toHaveBeenLastCalledWith({
                label: "Remember my preferences",
                role: "checkbox",
                landmarks,
            });
        });

        it("handles fake radios with default isClickable", async () => {
            await user.click(
                fakeInputsSection.getByRole("radio", {
                    name: "Regular crust",
                })
            );
            expect(onMetric).toHaveBeenLastCalledWith({
                label: "Regular crust",
                role: "radio",
                landmarks,
            });
        });
    });
});
