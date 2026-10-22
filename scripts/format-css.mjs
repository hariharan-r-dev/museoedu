import fs from "node:fs";
import path from "node:path";

const file = path.resolve(process.argv[2]);
const source = fs
  .readFileSync(file, "utf8")
  .replace(/\/\* (?:Design tokens|Reset and base styles|Header and navigation|Hero|Shared section layout|Selected experiences|About|Services|Principles|Insights|Footer|Motion|Responsive layout|Reduced-motion accessibility) \*\//g, "")
  .trim();

let output = "";
let indent = 0;
let buffer = "";
let quote = null;
let inComment = false;
let parenDepth = 0;

const indentation = () => "  ".repeat(indent);
const flush = () => {
  const value = buffer.trim();
  if (value) output += indentation() + value;
  buffer = "";
};

for (let index = 0; index < source.length; index += 1) {
  const character = source[index];
  const next = source[index + 1];

  if (inComment) {
    buffer += character;
    if (character === "*" && next === "/") {
      buffer += next;
      index += 1;
      inComment = false;
    }
    continue;
  }

  if (!quote && character === "/" && next === "*") {
    inComment = true;
    buffer += "/*";
    index += 1;
    continue;
  }

  if (quote) {
    buffer += character;
    if (character === quote && source[index - 1] !== "\\") quote = null;
    continue;
  }

  if (character === '"' || character === "'") {
    quote = character;
    buffer += character;
    continue;
  }

  if (character === "(") parenDepth += 1;
  if (character === ")") parenDepth -= 1;

  if (parenDepth === 0 && character === "{") {
    flush();
    output += " {\n";
    indent += 1;
    continue;
  }

  if (parenDepth === 0 && character === ";") {
    buffer += character;
    flush();
    output += "\n";
    continue;
  }

  if (parenDepth === 0 && character === "}") {
    flush();
    if (!output.endsWith("\n")) output += "\n";
    indent -= 1;
    output += indentation() + "}\n\n";
    continue;
  }

  buffer += character;
}

flush();

const sectionMarkers = new Map([
  [":root {", "/* Design tokens */\n:root {"],
  ["* {", "/* Reset and base styles */\n* {"],
  [".site-header {", "/* Header and navigation */\n.site-header {"],
  [".hero {", "/* Hero */\n.hero {"],
  [".section-shell {", "/* Shared section layout */\n.section-shell {"],
  [".work {", "/* Selected experiences */\n.work {"],
  [".about-grid {", "/* About */\n.about-grid {"],
  [".service-list {", "/* Services */\n.service-list {"],
  [".proof {", "/* Principles */\n.proof {"],
  [".article-grid {", "/* Insights */\n.article-grid {"],
  [".site-footer {", "/* Footer */\n.site-footer {"],
  [".reveal {", "/* Motion */\n.reveal {"],
  ["@media (max-width: 850px) {", "/* Responsive layout */\n@media (max-width: 850px) {"],
  ["@media (prefers-reduced-motion: reduce) {", "/* Reduced-motion accessibility */\n@media (prefers-reduced-motion: reduce) {"],
]);

for (const [selector, replacement] of sectionMarkers) {
  output = output.replace(selector, replacement);
}

output = output
  .replaceAll(",.", ",\n.")
  .replaceAll(",body", ",\nbody")
  .replaceAll(",html", ",\nhtml")
  .replaceAll(",*:before", ",\n*:before")
  .replaceAll(",*:after", ",\n*:after")
  .replace(/^(\s+)(--?[\w-]+|[a-z][\w-]*):\s*/gm, "$1$2: ")
  .replace(/,(?=[^\s\n])/g, ", ")
  .replace(/^(\s+(?:--?[\w-]+|[a-z][\w-]*):[^;{}\n]+)$/gm, "$1;")
  .replace(/^(\s*)([^{}\n]+),\n(?=[.#*])/gm, (match, spacing, selector) => `${spacing}${selector},\n${spacing}`)
  .replace(/(?<=\S)!important/g, " !important")
  .replace(/\n\n(\s*})/g, "\n$1")
  .replace(/\n{3,}/g, "\n\n")
  .trimEnd() + "\n";

fs.writeFileSync(file, output, "utf8");
