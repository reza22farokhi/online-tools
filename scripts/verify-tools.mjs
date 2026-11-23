import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcToolsDir = path.join(root, 'src', 'tools');
const pagesToolsDir = path.join(root, 'src', 'pages', 'tools');
const distToolsDir = path.join(root, 'dist', 'tools');
const registryFile = path.join(srcToolsDir, 'registry.ts');
const errors = [];

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
  });
}

function getDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

function getMetaSlug(filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push('Missing metadata file: ' + path.relative(root, filePath));
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/\\bslug\\s*:\\s*['"]([^'"]+)['"]/);
  if (!match) {
    errors.push('Metadata file has no literal slug: ' + path.relative(root, filePath));
    return null;
  }
  return match[1];
}

function compareSets(label, actualValues, expectedValues) {
  const actual = new Set(actualValues.filter(Boolean));
  const expected = new Set(expectedValues.filter(Boolean));
  const missing = [...expected].filter(value => !actual.has(value)).sort();
  const unexpected = [...actual].filter(value => !expected.has(value)).sort();
  const duplicates = getDuplicates(actualValues.filter(Boolean));

  if (missing.length || unexpected.length || duplicates.length) {
    errors.push(label + ' mismatch: ' + JSON.stringify({ missing, unexpected, duplicates }));
  }
}

if (!fs.existsSync(registryFile)) {
  console.error('Tool registry not found: ' + path.relative(root, registryFile));
  process.exit(1);
}

const registrySource = fs.readFileSync(registryFile, 'utf8');
// The registry is assembled from imported metadata modules. Accept the typed
// source array rather than requiring a legacy inline ToolMeta[] declaration.
const registryMatch = registrySource.match(
  /const\\s+registeredTools\\s*:\\s*Omit<ToolMeta,\\s*['"]qaProfile['"]>\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\n\\];/
);
if (!registryMatch) {
  console.error('Could not parse the registeredTools source array.');
  process.exit(1);
}

const registryMetaImports = [...registrySource.matchAll(
  /import\\s+\\{\\s*meta\\s+as\\s+\\w+\\s*\\}\\s+from\\s+['"]([^'"]+)['"]/g
)].map(match => path.resolve(path.dirname(registryFile), match[1] + '.ts'));

const importedRegistrySlugs = registryMetaImports.map(getMetaSlug);
const literalRegistrySlugs = [...registryMatch[1].matchAll(
  /\\bslug\\s*:\\s*['"]([^'"]+)['"]/g
)].map(match => match[1]);
const registrySlugs = [...importedRegistrySlugs, ...literalRegistrySlugs];

const sourceToolFiles = walkFiles(srcToolsDir).filter(file => path.basename(file) === 'Tool.astro');
const sourceToolDirs = sourceToolFiles.map(file => path.dirname(file));
const sourceToolSlugs = sourceToolDirs.map(directory => path.basename(directory));

for (const directory of sourceToolDirs) {
  const hasMeta = ['meta.ts', 'meta.js'].some(name => fs.existsSync(path.join(directory, name)));
  if (!hasMeta) errors.push('Tool component has no metadata: ' + path.relative(root, directory));
}

const standaloneRouteFiles = walkFiles(pagesToolsDir).filter(file =>
  path.basename(file) === 'index.astro' && path.dirname(file) !== pagesToolsDir
);
const standaloneSlugs = standaloneRouteFiles.map(file => path.basename(path.dirname(file)));

const allMetaFiles = walkFiles(srcToolsDir).filter(file =>
  path.basename(file) === 'meta.ts' || path.basename(file) === 'meta.js'
);
const allMetaSlugs = allMetaFiles.map(getMetaSlug);
const expectedMetaSlugs = [...registrySlugs, ...standaloneSlugs];
const expectedBuiltSlugs = [...registrySlugs, ...standaloneSlugs];

if (!fs.existsSync(distToolsDir)) {
  errors.push('Built tools directory not found: ' + path.relative(root, distToolsDir));
}

const builtSlugs = fs.existsSync(distToolsDir)
  ? fs.readdirSync(distToolsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  : [];

compareSets('Source Tool.astro files vs registry', sourceToolSlugs, registrySlugs);
compareSets('Metadata modules vs registry and standalone routes', allMetaSlugs, expectedMetaSlugs);
compareSets('Built tool directories vs registry and standalone routes', builtSlugs, expectedBuiltSlugs);

for (const slug of expectedBuiltSlugs) {
  const builtPage = path.join(distToolsDir, slug, 'index.html');
  if (!fs.existsSync(builtPage)) errors.push('Missing built route: ' + path.relative(root, builtPage));
}

if (registrySlugs.length < 42) {
  errors.push('Registered tool count dropped below the required baseline of 42: ' + registrySlugs.length);
}

console.log('Registered tools:          ' + registrySlugs.length);
console.log('Tool.astro components:      ' + sourceToolSlugs.length);
console.log('Standalone tool routes:     ' + standaloneSlugs.length);
console.log('Metadata modules:           ' + allMetaSlugs.length);
console.log('Built tool directories:     ' + builtSlugs.length);

if (errors.length) {
  console.error('\\nTool registry/build parity failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}

console.log('\\nTool registry, source components, metadata, and built routes are in exact parity.');
