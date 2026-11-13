import fs from 'node:fs';
import path from 'node:path';

// تابع بازگشتی برای شمارش فایل‌های meta.ts در پوشه منبع
function countMetaFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      count += countMetaFiles(path.join(dir, file.name));
    } else if (file.name === 'meta.ts' || file.name === 'meta.js') {
      count++;
    }
  }
  return count;
}

// 1. شمارش ابزارهای موجود در کد منبع
const srcToolsDir = path.join(process.cwd(), 'src', 'tools');
const expectedTools = countMetaFiles(srcToolsDir);

// 2. شمارش پوشه‌های ساخته‌شده در dist
const distDir = path.join(process.cwd(), 'dist', 'tools');
if (!fs.existsSync(distDir)) {
  console.error("❌ Error: dist/tools directory not found!");
  process.exit(1);
}

const builtTools = fs.readdirSync(distDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory()).length;

// 3. مقایسه و اعتبارسنجی
console.log(`📦 Expected tools (meta.ts): ${expectedTools}`);
console.log(`🔨 Built tool directories:   ${builtTools}`);

if (expectedTools !== builtTools) {
  console.error(`❌ Mismatch! Expected ${expectedTools} built tools, but found ${builtTools}.`);
  process.exit(1);
}
console.log("✅ Tool count verification passed perfectly!");
