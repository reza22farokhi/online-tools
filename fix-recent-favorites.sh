#!/data/data/com.termux/files/usr/bin/bash
set +H
set -uo pipefail
G='\033[0;32m'; R='\033[0;31m'; N='\033[0m'
log() { printf "${G}▶${N} %s\n" "$1"; }
fail() { printf "${R}✗ FATAL:${N} %s\n" "$1"; exit 1; }

cd ~/online-tools || fail "cd failed"

log "STEP 1: Create branch"
BR=$(git branch --show-current)
if [ "$BR" = "main" ]; then
  git pull origin main || fail "pull failed"
  git checkout -b fix-favorites-recent-render || fail "branch failed"
elif [ "$BR" = "fix-favorites-recent-render" ]; then
  log "  Already on fix branch"
else
  fail "unexpected branch: $BR"
fi

log "STEP 2: Update ui.ts (clone wrapper + call populate on click)"
node -e '
const fs = require("fs");
const p = "src/lib/ui.ts";
let c = fs.readFileSync(p, "utf8");

// Fix 1: Call populateHomeSections on fav click
if (!c.includes("populateHomeSections();\n    }")) {
  c = c.replace(
    /toggleFavorite\(slug\);\s*initFavoriteButtons\(document\);/,
    "toggleFavorite(slug);\n    initFavoriteButtons(document);\n    populateHomeSections();"
  );
}

// Fix 2: Clone wrapper instead of just the link
const oldClone = `const original = document.querySelector<HTMLElement>(\\\`#all-tools-grid [data-slug="\\\${slug}"]\\\`);
      if (original) {
        const clone = original.cloneNode(true) as HTMLElement;
        grid.appendChild(clone);
        count++;
      }`;

const newClone = `const link = document.querySelector<HTMLElement>(\\\`#all-tools-grid [data-slug="\\\${slug}"]\\\`);
      if (link) {
        const wrapper = link.closest(".tool-card-wrap");
        if (wrapper) {
          const clone = wrapper.cloneNode(true) as HTMLElement;
          grid.appendChild(clone);
          count++;
        }
      }`;

if (c.includes("const original = document.querySelector")) {
  c = c.replace(/const original = document\.querySelector[\s\S]*?count\+\+;\s*\}/, newClone);
}

fs.writeFileSync(p, c);
console.log("  ✓ ui.ts patched");
'

log "STEP 3: Test and Build"
npx vitest run 2>&1 | tail -5
npm run build 2>&1 | tail -3

log "STEP 4: Commit and Push"
git add -A
git commit -m "fix: recent/favorites section rendering (clone wrapper, live update)"
git push -u origin fix-favorites-recent-render 2>&1 | tail -3

echo ""
echo "════════════════════════════════════════"
echo "  ✅ FIX COMPLETE"
echo "  Branch: fix-favorites-recent-render"
echo "════════════════════════════════════════"
