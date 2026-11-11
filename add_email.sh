#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/online-tools

echo "▶ Adding email to about.astro"
node -e '
const fs = require("fs");
const path = "src/pages/about.astro";
let content = fs.readFileSync(path, "utf8");
const email = "reza22farokhi@gmail.com";

if (content.includes(email)) {
  console.log("  ⚠ Email already exists in about.astro");
} else {
  const injection = `      <h2>ارتباط با ما</h2>\n      <p>\n        برای ارتباط مستقیم با مدیر پلتفرم یا ارسال پیشنهادات، می‌توانید از طریق ایمیل زیر با ما در تماس باشید:\n      </p>\n      <p><a href="mailto:${email}">${email}</a></p>\n    </div>\n  </div>\n</BaseLayout>`;
  content = content.replace(/    <\/div>\s*<\/div>\s*<\/BaseLayout>/, injection);
  fs.writeFileSync(path, content);
  console.log("  ✓ Email added to about.astro");
}
'

echo "▶ Updating email in contact.astro"
sed -i 's/contact@example.com/reza22farokhi@gmail.com/g' src/pages/contact.astro
echo "  ✓ contact.astro updated"

echo "▶ Verifying changes"
grep -c "reza22farokhi@gmail.com" src/pages/about.astro src/pages/contact.astro

echo "▶ Building"
if ! npm run build 2>&1 | tail -5; then
  echo "✗ Build failed"; exit 1
fi

echo ""
echo "════════════════════════════════════════"
echo "  ✅ EMAIL INJECTED SUCCESSFULLY"
echo "════════════════════════════════════════"
