#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/online-tools

echo "▶ Fixing contrast ratios in tokens.css"
node -e '
const fs = require("fs");
const path = "src/styles/tokens.css";
let c = fs.readFileSync(path, "utf8");

// Light mode: Darken muted text for better contrast on light backgrounds
c = c.replace("--color-text-muted: #64748b;", "--color-text-muted: #475569;");

// Dark mode: Lighten muted text for better contrast on dark backgrounds
c = c.replace("--color-text-muted: #94a3b8;", "--color-text-muted: #cbd5e1;");

fs.writeFileSync(path, c);
console.log("  ✓ tokens.css updated with high-contrast muted colors");
'

echo "▶ Ensuring placeholder color uses the same accessible muted color"
cat >> src/styles/global.css << 'CSS_END'

/* Improved placeholder contrast for accessibility */
::placeholder {
  color: var(--color-text-muted);
  opacity: 1;
}
CSS_END

echo "▶ Building"
if ! npm run build 2>&1 | tail -4; then
  echo "✗ Build failed"; exit 1
fi

echo "▶ Committing and pushing"
git add src/styles/tokens.css src/styles/global.css
git commit -m "a11y: improve color contrast to pass WCAG AA"
git push

echo ""
echo "════════════════════════════════════════"
echo "  ✅ ACCESSIBILITY FIX COMPLETE"
echo "════════════════════════════════════════"
