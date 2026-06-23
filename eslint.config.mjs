import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Tailwind's default colour scales — banned in className in favour of the
// design tokens defined in src/app/globals.css (bg-surface, text-muted, …).
const DEFAULT_SCALES =
  "(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|[1-9]00|950)";
const HEX = "#[0-9a-fA-F]{3,8}";
const DARK_VARIANT = "dark:";

// Build a selector that matches both string and template-literal className
// values whose text matches `regex`.
const inClassName = (regex) =>
  `JSXAttribute[name.name="className"] Literal[value=/${regex}/], ` +
  `JSXAttribute[name.name="className"] TemplateElement[value.raw=/${regex}/]`;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: inClassName(DEFAULT_SCALES),
          message:
            "Use a design token (bg-surface, text-muted, text-foreground, text-brand, border-border, text-success, text-danger), not a raw Tailwind colour scale. See src/app/globals.css.",
        },
        {
          selector: inClassName(HEX),
          message:
            "No raw hex colours in className. Add a token in src/app/globals.css and use the generated utility instead.",
        },
        {
          selector: inClassName(DARK_VARIANT),
          message:
            "Don't use dark: variants — colours adapt automatically via tokens (.dark overrides in src/app/globals.css).",
        },
      ],
    },
  },
  // The OG image renders with inline styles (no Tailwind), so raw hex is
  // unavoidable there. Token definitions in CSS aren't linted by ESLint.
  {
    files: ["src/app/**/opengraph-image.tsx", "src/app/**/icon.tsx"],
    rules: { "no-restricted-syntax": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
