import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "@/components/faq";

describe("Faq", () => {
  it("abre una respuesta y actualiza aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const button = screen.getByRole("button", { name: /puedo comenzar/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/se ajusta a tu momento/i)).toBeVisible();
  });
});
