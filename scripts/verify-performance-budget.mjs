import { readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const assetRoot = resolve('dist/_astro');
const budgets = {
  totalJavaScript: 256 * 1024,
  totalCss: 192 * 1024,
  largestJavaScript: 64 * 1024,
  largestCss: 96 * 1024
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else if (entry.isFile()) files.push({ path, size: (await stat(path)).size });
  }

  return files;
}

const assets = await collectFiles(assetRoot);
const javascript = assets.filter(file => file.path.endsWith('.js'));
const stylesheets = assets.filter(file => file.path.endsWith('.css'));

if (javascript.length === 0 || stylesheets.length === 0) {
  console.error('Performance budget check failed: expected JS and CSS assets in dist/_astro.');
  process.exit(1);
}

const total = files => files.reduce((sum, file) => sum + file.size, 0);
const largest = files => files.reduce((max, file) => Math.max(max, file.size), 0);

const metrics = {
  totalJavaScript: total(javascript),
  totalCss: total(stylesheets),
  largestJavaScript: largest(javascript),
  largestCss: largest(stylesheets)
};

console.log('Static asset performance budget (raw bytes):');
for (const [key, value] of Object.entries(metrics)) {
  console.log(`- ${key}: ${value.toLocaleString()} / ${budgets[key].toLocaleString()}`);
}

const failures = Object.entries(budgets)
  .filter(([key, limit]) => metrics[key] > limit)
  .map(([key, limit]) => `${key} exceeded: ${metrics[key]} > ${limit}`);

if (failures.length > 0) {
  console.error('Performance budget exceeded:\n' + failures.join('\n'));
  process.exit(1);
}

console.log('Performance budgets passed.');
