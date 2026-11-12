#!/data/data/com.termux/files/usr/bin/bash
set -uo pipefail
G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'; N='\033[0m'
log() { echo -e "${G}▶${N} $1"; }
warn() { echo -e "${Y}⚠${N} $1"; }

cd ~/online-tools || { echo "خطا: پوشه پیدا نشد"; exit 1; }

echo "════════════════════════════════════════"
echo "وضعیت قبل از پاکسازی:"
echo "════════════════════════════════════════"
echo "شاخه فعلی: $(git branch --show-current)"
git status --short
echo ""

log "۱. بازگشت به شاخه main..."
git checkout main || { echo "خطا در checkout"; exit 1; }

log "۲. حذف شاخه feature/android-capacitor از لوکال..."
git branch -D feature/android-capacitor 2>/dev/null && echo "  ✓ حذف شد" || warn "  شاخه از قبل نبود"

log "۳. حذف شاخه از GitHub (اختیاری)..."
git push origin --delete feature/android-capacitor 2>&1 | tail -2 || true

log "۴. پاکسازی فایل‌های جامانده اندروید..."
rm -rf android/ 2>/dev/null && echo "  ✓ android/ حذف شد" || true
rm -f capacitor.config.ts 2>/dev/null && echo "  ✓ capacitor.config.ts حذف شد" || true
rm -rf scripts/ 2>/dev/null && echo "  ✓ scripts/ حذف شد" || true
rm -f src/lib/storage.ts 2>/dev/null && echo "  ✓ storage.ts حذف شد" || true
rm -f src/lib/native.ts 2>/dev/null && echo "  ✓ native.ts حذف شد" || true
rm -f setup-android.sh resume-android.sh fix-android-tests.sh 2>/dev/null && echo "  ✓ اسکریپت‌های اندروید حذف شدند" || true

log "۵. حذف پکیج‌های Capacitor از node_modules..."
rm -rf node_modules/@capacitor/ 2>/dev/null && echo "  ✓ پکیج‌ها حذف شدند" || true

log "۶. بازسازی node_modules (همگام با main)..."
npm install 2>&1 | tail -3

log "۷. اجرای تست برای اطمینان از سلامت..."
npx vitest run 2>&1 | tail -4

log "۸. بیلد نسخه وب (تأیید نهایی)..."
npm run build 2>&1 | tail -3

echo ""
echo "════════════════════════════════════════"
echo "وضعیت بعد از پاکسازی:"
echo "════════════════════════════════════════"
echo "شاخه فعلی: $(git branch --show-current)"
echo "آخرین commit: $(git log --oneline -1)"
echo ""
echo "git status (باید خالی باشد):"
git status --short
echo ""
echo "src/lib/ (بدون storage.ts و native.ts):"
ls src/lib/
echo ""
echo "src/tools/ (باید ۸ دسته باشد):"
ls src/tools/
echo ""
echo "════════════════════════════════════════"
echo "✅ پاکسازی کامل شد"
echo "════════════════════════════════════════"
