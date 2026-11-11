#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/online-tools

echo "▶ Creating AdSlot component"
cat > src/components/ui/AdSlot.astro << 'FILE_END'
---
export interface Props {
  id: string;
}
const { id } = Astro.props;
---
<div class="ad-slot-wrap">
  <div id={id}></div>
</div>

<style>
  .ad-slot-wrap {
    display: flex;
    justify-content: center;
    margin-block: var(--space-4);
    min-height: 120px;
    background: var(--color-surface-2);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    align-items: center;
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }
</style>
FILE_END
echo "  ✓ AdSlot.astro created"

echo "▶ Injecting AdSlot into ToolLayout.astro"
node -e '
const fs = require("fs");
const path = "src/layouts/ToolLayout.astro";
let content = fs.readFileSync(path, "utf8");

const adImport = `import ToolCard from "../components/ui/ToolCard.astro";\nimport AdSlot from "../components/ui/AdSlot.astro";`;
content = content.replace(`import ToolCard from "../components/ui/ToolCard.astro";`, adImport);

const adMarkup = `    <div class="tool-body card">\n      <slot />\n    </div>\n\n    <AdSlot id="pos-article-display-card-124132" />\n`;

content = content.replace(`    <div class="tool-body card">\n      <slot />\n    </div>\n`, adMarkup);
fs.writeFileSync(path, content);
console.log("  ✓ ToolLayout updated");
'

echo "▶ Injecting AdSlot into BlogLayout.astro"
node -e '
const fs = require("fs");
const path = "src/layouts/BlogLayout.astro";
let content = fs.readFileSync(path, "utf8");

const adImport = `import BaseLayout from "./BaseLayout.astro";\nimport AdSlot from "../components/ui/AdSlot.astro";`;
content = content.replace(`import BaseLayout from "./BaseLayout.astro";`, adImport);

const adMarkup = `    <div class="post-content card">\n      <slot />\n    </div>\n    <AdSlot id="pos-article-display-card-124132" />\n`;

content = content.replace(`    <div class="post-content card">\n      <slot />\n    </div>\n`, adMarkup);
fs.writeFileSync(path, content);
console.log("  ✓ BlogLayout updated");
'
