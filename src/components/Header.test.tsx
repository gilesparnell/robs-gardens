import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

const renderHeader = () =>
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
  );

describe("Header semantics", () => {
  it("does not render any h1 (the homepage h1 lives in Hero)", () => {
    renderHeader();
    const h1s = screen.queryAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(0);
  });

  it("still announces the brand to assistive technology", () => {
    renderHeader();
    expect(
      screen.getByLabelText(/Rob Gardening and Maintenance/i),
    ).toBeInTheDocument();
  });

  it("still renders the visible brand text", () => {
    renderHeader();
    expect(screen.getByText(/Rob Gardening/)).toBeInTheDocument();
    expect(screen.getByText(/& Maintenance/)).toBeInTheDocument();
  });
});
