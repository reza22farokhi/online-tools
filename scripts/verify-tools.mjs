import fs from 'node:fs';
import path from 'node:path';

const registryFile = fs.readFileSync('src/tools/registry.ts', 'utf8');
const registeredTools = (registryFile.match(/slug:\s*['"`](.*?)['"`]/g) || []).length;

const distDir = path.join(process.cwd(), 'dist', 'tools');
if (!fs.existsSync(distDir)) {
  console.error("❌ Error: dist/tools directory not found!");
  process.exit(1);
}

const builtTools = fs.readdirSync(distDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory()).length;

console.log(`📦 Registered tools in code: ${registeredTools}`);
console.log(`🔨 Built tool directories:   ${builtTools}`);

if (registeredTools !== builtTools) {
  console.error(`❌ Mismatch! Expected ${registeredTools} built tools, but found ${builtTools}.`);
  process.exit(1);
}
console.log("✅ Tool count verification passed!");
