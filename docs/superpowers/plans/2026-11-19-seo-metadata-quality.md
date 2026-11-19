# SEO Metadata Quality Implementation Plan

> **For agentic workers:** Execute this plan inline with the existing GitHub branch and verify each task with CI.

**Goal:** Improve Persian and English search snippets across the homepage, all 42 registered tools, and the standalone JWT Inspector without changing tool behavior or weakening security.

**Architecture:** Keep tool names and H1 text stable. Add optional SEO-specific titles only where generated titles are outside the target range. Expand unique Persian and English meta descriptions to 120–155 characters. Fix the standalone JWT Inspector's custom title, description, and heading hierarchy. Add automated metadata regression checks before changing copy.

**Tech Stack:** Astro 7, TypeScript, Vitest, Playwright, GitHub Actions, static GitHub Pages deployment.

**Spec:** Grounded in the deployed gh-pages HTML audit performed on 2026-11-19.

## Global Constraints

- Preserve all existing routes, tool names, H1 text, and application behavior.
- Keep canonical URLs absolute, self-referencing HTTPS URLs.
- Keep one H1 per page and do not introduce heading-level skips.
- Persian and English copy must be unique, accurate, natural, and free of keyword stuffing.
- Meta descriptions target 120–155 characters, including spaces.
- SEO titles target 30–60 characters, including spaces.
- Keep CSP restrictive; do not add external scripts or ad providers.
- Keep privacy claims consistent with actual client-side processing.
- Do not claim rankings, traffic, or indexing status without live evidence.

## Review Focus

- Persian and English copy length must be measured after HTML entity decoding.
- SEO titles must not change visible H1 labels or tool-card names.
- Metadata changes must not alter route generation or JSON-LD schema validity.
- JWT Inspector metadata must remain consistent with its local-processing privacy notice.
- Homepage description must reflect the actual catalogue and browser-local processing.

---

### Task 1: Add metadata regression tests

**Files:**
- Create: tests/unit/seo-metadata.test.ts
- Read: src/tools/registry.ts, src/tools/types.ts, src/lib/seo.ts

**Interfaces:**
- Consumes: registry ToolMeta array and DEFAULT_DESCRIPTION.
- Produces: automated checks for all registered Persian/English descriptions and generated title lengths.

- [x] Write tests for 42 registered tools' Persian and English descriptions (120–155 characters).
- [x] Write tests for generated Persian/English SEO titles (30–60 characters).
- [x] Write a test for the homepage default description.
- [x] Run the focused test and confirm it fails on current metadata.

### Task 2: Support SEO-specific titles without changing visible names

**Files:**
- Modify: src/tools/types.ts
- Modify: src/layouts/ToolLayout.astro
- Modify: metadata for age, regex tester, unit converter, UUID generator, and JWT decoder.

**Interfaces:**
- Consumes: existing ToolMeta.name and optional SEO title.
- Produces: optional seoTitle with fa/en strings; HTML title falls back to existing name plus brand.

- [x] Add the optional type.
- [x] Use the optional title in the HTML title tag only; preserve H1 and tool-card names.
- [x] Add titles only to pages currently outside the 30–60 character range.
- [x] Run metadata tests and type checks.

### Task 3: Refresh metadata descriptions and JWT Inspector headings

**Files:**
- Modify: all 42 src/tools/**/meta.ts files.
- Modify: src/lib/seo.ts homepage description.
- Modify: src/pages/index.astro English homepage description if needed.
- Modify: src/tools/jwt-inspector/JwtInspector.astro.

- [x] Write unique Persian and English descriptions of 120–155 characters for every registered tool.
- [x] Update homepage descriptions in both languages.
- [x] Shorten JWT Inspector title and description; use H2 for top-level sections currently marked H3.
- [x] Run metadata tests, unit tests, type checks, and build.

### Task 4: Verify generated production HTML

**Files:** No additional production files.

- [x] Run all Playwright E2E tests.
- [x] Verify generated HTML for the homepage, all 42 tool routes, and standalone JWT Inspector.
- [x] Verify title and description lengths, canonical URLs, H1 counts, JSON-LD presence, and no ad-provider references.
- [x] Open PR #37; all CI checks are green. Merge is the final release action.
