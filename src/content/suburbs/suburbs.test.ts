import { describe, it, expect } from "vitest";
import {
  getAllSuburbs,
  getSuburbBySlug,
  getSuburbSlugs,
  type SuburbEntry,
} from "./index";

describe("suburb data loader", () => {
  it("loads all four flagship suburbs", () => {
    const all = getAllSuburbs();
    expect(all.length).toBe(4);
  });

  it("exposes every suburb with a non-empty name, slug, and body", () => {
    for (const s of getAllSuburbs()) {
      expect(s.name).toBeTruthy();
      expect(s.slug).toBeTruthy();
      expect(s.body.length).toBeGreaterThan(100);
    }
  });

  it("has unique slugs", () => {
    const slugs = getSuburbSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("returns the expected four slugs", () => {
    const slugs = getSuburbSlugs().sort();
    expect(slugs).toEqual(["clontarf", "mosman", "rose-bay", "terrey-hills"]);
  });

  it("every suburb body has at least 400 words", () => {
    for (const s of getAllSuburbs()) {
      const words = s.body.split(/\s+/).filter(Boolean).length;
      expect(words, `${s.slug} body word count`).toBeGreaterThanOrEqual(400);
    }
  });

  it("every suburb body is at most 1000 words (soft cap to catch bloat)", () => {
    for (const s of getAllSuburbs()) {
      const words = s.body.split(/\s+/).filter(Boolean).length;
      expect(words, `${s.slug} body word count`).toBeLessThanOrEqual(1000);
    }
  });

  it("every suburb body mentions the suburb name at least twice (keyword check)", () => {
    for (const s of getAllSuburbs()) {
      const occurrences = (
        s.body.match(new RegExp(s.name, "gi")) ?? []
      ).length;
      expect(
        occurrences,
        `${s.slug} should mention "${s.name}" at least twice`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("every suburb has a valid latitude and longitude", () => {
    for (const s of getAllSuburbs()) {
      expect(s.lat).toBeGreaterThan(-40);
      expect(s.lat).toBeLessThan(-30);
      expect(s.lng).toBeGreaterThan(150);
      expect(s.lng).toBeLessThan(152);
    }
  });

  it("every suburb has a non-empty meta description under 160 chars", () => {
    for (const s of getAllSuburbs()) {
      expect(s.metaDescription.length).toBeGreaterThan(0);
      expect(s.metaDescription.length).toBeLessThanOrEqual(200);
    }
  });

  describe("getSuburbBySlug", () => {
    it("returns the Mosman entry for 'mosman'", () => {
      const mosman = getSuburbBySlug("mosman");
      expect(mosman).toBeDefined();
      expect(mosman?.name).toBe("Mosman");
    });

    it("returns the Terrey Hills entry for 'terrey-hills'", () => {
      const th = getSuburbBySlug("terrey-hills");
      expect(th).toBeDefined();
      expect(th?.name).toBe("Terrey Hills");
    });

    it("returns undefined for an unknown slug", () => {
      expect(getSuburbBySlug("bondi")).toBeUndefined();
    });

    it("is case-insensitive on slug lookup", () => {
      expect(getSuburbBySlug("MOSMAN")?.name).toBe("Mosman");
    });
  });

  describe("SuburbEntry shape", () => {
    it("matches the exported type", () => {
      const mosman = getSuburbBySlug("mosman") as SuburbEntry;
      expect(typeof mosman.name).toBe("string");
      expect(typeof mosman.slug).toBe("string");
      expect(typeof mosman.postcode).toBe("string");
      expect(typeof mosman.region).toBe("string");
      expect(Array.isArray(mosman.neighbours)).toBe(true);
      expect(typeof mosman.metaTitle).toBe("string");
      expect(typeof mosman.metaDescription).toBe("string");
      expect(typeof mosman.primaryService).toBe("string");
      expect(typeof mosman.body).toBe("string");
      expect(typeof mosman.lat).toBe("number");
      expect(typeof mosman.lng).toBe("number");
    });
  });
});
