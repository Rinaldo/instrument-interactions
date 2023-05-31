import { getByLabelText, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { createMetric, instrumentClicks, withLandmarks } from "../src";
import { bodyContent } from "./test-page";

describe("instrumentClicks", () => {
    const user = userEvent.setup();
    const onMetric = jest.fn();

    document.body.innerHTML = bodyContent;

    const unsubscribe = instrumentClicks({
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

        it("handles fake buttons", async () => {
            await user.click(
                buttonsSection.getByRole("button", {
                    name: "Fake Button",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Fake Button",
                role: "button",
                landmarks,
            });
        });

        it("handles tabs", async () => {
            await user.click(
                buttonsSection.getByRole("tab", {
                    name: "First Tab",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "First Tab",
                role: "tab",
                landmarks,
            });
        });

        it("handles keyboard interactions", async () => {
            await user.click(
                buttonsSection.getByRole("button", {
                    name: "Real Button",
                })
            );
            expect(onMetric).toHaveBeenLastCalledWith({
                label: "Real Button",
                role: "button",
                landmarks,
            });
            await user.type(
                buttonsSection.getByRole("button", {
                    name: "Fake Button",
                }),
                "{Enter}"
            );
            expect(onMetric).toHaveBeenLastCalledWith({
                label: "Fake Button",
                role: "button",
                landmarks,
            });
        });
    });

    describe("links", () => {
        const linksSection = within(getByLabelText(document.body, "Links"));

        const landmarks = [
            {
                role: "region",
                label: "Links",
            },
            {
                role: "main",
            },
        ];

        it("requires links to have an href attribute", async () => {
            await user.click(linksSection.getByText("Link without href"));
            expect(onMetric).not.toHaveBeenCalled();
        });

        it("handles normal links", async () => {
            await user.click(
                within(
                    linksSection.getByRole("link", {
                        name: "Real Link",
                    })
                ).getByText("Real")
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Real Link",
                role: "link",
                landmarks,
            });
        });

        it("handles links that contain labeled images", async () => {
            await user.click(
                linksSection.getByRole("link", {
                    name: "Grapefruit",
                })
            );
            expect(onMetric).toHaveBeenCalledWith({
                label: "Grapefruit",
                role: "link",
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

        it("handles fake checkboxes", async () => {
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

        it("handles fake radios", async () => {
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
