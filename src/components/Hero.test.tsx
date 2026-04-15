import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero h1 semantics", () => {
  it("renders exactly one h1 element", () => {
    render(<Hero />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
  });

  it("h1 contains the primary keyword Garden Maintenance & Lawn Care", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/Garden Maintenance\s*&\s*Lawn Care/);
  });

  it("h1 mentions Northern Beaches (primary service area)", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/Northern Beaches/);
  });

  it("h1 mentions Central Coast (outer service area)", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/Central Coast/);
  });

  it("still shows the 'The Art of Green Care' tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/The Art of Green Care/i)).toBeInTheDocument();
  });
});
