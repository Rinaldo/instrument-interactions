import { getByLabelText, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { instrumentApp, getLabel, getLandmarks, getRole } from "../src";
import { bodyContent } from "./test-page";

describe("instrumentApp", () => {
    const user = userEvent.setup();
    const onMetric = jest.fn();

    document.body.innerHTML = bodyContent;

    const unsubscribe = instrumentApp({
        onInteraction: (element) => {
            onMetric({
                label: getLabel(element),
                role: getRole(element),
                landmarks: getLandmarks(element),
            });
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
        const fakeInputsSection = within(getByLabelText(document.body, "Fake Inputs"));

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

    describe("real inputs", () => {
        const inputsSection = within(getByLabelText(document.body, "Inputs"));

        const landmarks = [
            {
                role: "region",
                label: "Inputs",
            },
            {
                role: "main",
            },
        ];

        it("handles text inputs", async () => {
            await user.type(
                inputsSection.getByRole("textbox", {
                    name: "Full Name",
                }),
                "foo"
            );
            await user.tab();
            expect(onMetric).toHaveBeenCalledWith({
                label: "Full Name",
                role: "textbox",
                landmarks,
            });
        });

        it("handles number inputs", async () => {
            await user.type(
                inputsSection.getByRole("spinbutton", {
                    name: "Age",
                }),
                "100"
            );
            await user.tab();
            expect(onMetric).toHaveBeenCalledWith({
                label: "Age",
                role: "spinbutton",
                landmarks,
            });
        });

        it("handles checkbox inputs", async () => {
            await user.click(
                inputsSection.getByRole("checkbox", {
                    name: "Subscribe to newsletter?",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Subscribe to newsletter?",
                role: "checkbox",
                landmarks,
            });
        });

        it("handles radio inputs", async () => {
            await user.click(
                inputsSection.getByRole("radio", {
                    name: "Louie",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Louie",
                role: "radio",
                landmarks,
            });
        });

        it("handles native select elements", async () => {
            await user.selectOptions(
                inputsSection.getByRole("combobox", {
                    name: "Choose a pet",
                }),
                "goldfish"
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Choose a pet",
                role: "combobox",
                landmarks,
            });
        });

        it("returns an unsubscribe function", async () => {
            unsubscribe();
            await user.click(
                inputsSection.getByRole("radio", {
                    name: "Huey",
                })
            );
            await user.tab();
            expect(onMetric).not.toHaveBeenCalled();
        });
    });
});
