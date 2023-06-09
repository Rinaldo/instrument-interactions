import { getByLabelText, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { instrumentChanges, withLandmarks } from "../src";
import { bodyContent } from "./test-page";

describe("instrumentChanges", () => {
    const user = userEvent.setup();
    const onMetric = jest.fn();

    document.body.innerHTML = bodyContent;

    const unsubscribe = instrumentChanges({
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
