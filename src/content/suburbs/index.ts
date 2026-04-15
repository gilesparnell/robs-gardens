export interface SuburbEntry {
  name: string;
  slug: string;
  postcode: string;
  region: string;
  neighbours: string[];
  metaTitle: string;
  metaDescription: string;
  primaryService: string;
  lat: number;
  lng: number;
  body: string;
}

// Vite glob-imports every .md file in this directory as raw text at build time.
// This works in both the runtime bundle and in vitest because Vite's loader
// handles the `?raw` suffix identically in both contexts.
const rawFiles = import.meta.glob("./*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Lightweight frontmatter parser — we control the schema, so we don't need
// grey-matter's eval-based engine detection (which breaks in browser bundles).
// Handles the shapes we actually use: key-value pairs with optional quoting,
// numbers, and inline arrays of strings.
function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, yamlBlock, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const trimmed = rawValue.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1).trim();
      data[key] =
        inner.length === 0
          ? []
          : inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    const unquoted = trimmed.replace(/^["']|["']$/g, "");
    if (/^-?\d+(\.\d+)?$/.test(unquoted)) {
      data[key] = Number(unquoted);
    } else {
      data[key] = unquoted;
    }
  }

  return { data, content };
}

function parseEntry(filePath: string, raw: string): SuburbEntry {
  const { data, content } = parseFrontmatter(raw);
  const derivedSlug = filePath
    .split("/")
    .pop()!
    .replace(/\.md$/, "")
    .toLowerCase();

  const neighbours = Array.isArray(data.neighbours)
    ? (data.neighbours as unknown[]).map((n) => String(n))
    : [];

  return {
    name: String(data.name ?? ""),
    slug: String(data.slug ?? derivedSlug).toLowerCase(),
    postcode: String(data.postcode ?? ""),
    region: String(data.region ?? ""),
    neighbours,
    metaTitle: String(data.metaTitle ?? ""),
    metaDescription: String(data.metaDescription ?? ""),
    primaryService: String(data.primaryService ?? ""),
    lat: Number(data.lat ?? 0),
    lng: Number(data.lng ?? 0),
    body: content.trim(),
  };
}

const entries: SuburbEntry[] = Object.entries(rawFiles)
  .map(([filePath, raw]) => parseEntry(filePath, raw))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getAllSuburbs(): SuburbEntry[] {
  return entries;
}

export function getSuburbSlugs(): string[] {
  return entries.map((e) => e.slug);
}

export function getSuburbBySlug(slug: string): SuburbEntry | undefined {
  const needle = slug.toLowerCase();
  return entries.find((e) => e.slug === needle);
}
