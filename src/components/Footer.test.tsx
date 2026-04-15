import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer version display", () => {
  it("renders a version line matching vX.Y.Z (sha7)", () => {
    render(<Footer />);
    const versionLine = screen.getByTestId("app-version");
    expect(versionLine.textContent).toMatch(/^v\d+\.\d+\.\d+ \([0-9a-f]{7}\)$/);
  });

  it("uses monospace class for the version line", () => {
    render(<Footer />);
    const versionLine = screen.getByTestId("app-version");
    expect(versionLine.className).toContain("font-mono");
  });
});
