import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

describe("Editor de archivos Markdown", () => {
  it("carga el texto de un archivo .md", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);
    const file = new File(["# Mi guía\n\nContenido de prueba."], "mi-guia.md", { type: "text/markdown" });

    await user.upload(screen.getByLabelText("Cargar archivo Markdown"), file);

    expect(onChange).toHaveBeenCalledWith("# Mi guía\n\nContenido de prueba.");
  });
});
