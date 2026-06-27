// @req SCD-DEPLOY-001
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const ROOT = process.cwd();
const REQUIREMENTS_PATH = path.join(ROOT, 'requirements.yaml');
const REQ_ANNOTATION = /@req\s+(SCD-[A-Z0-9-]+)/g;

const SCAN_ROOTS = ['app', 'components', 'lib', 'scripts'] as const;
const SKIP_DIRS = new Set(['node_modules', '.next']);

type RequirementsDoc = {
  requirements: Array<{ id: string }>;
};

function parseRequirementIds(): string[] {
  const raw = readFileSync(REQUIREMENTS_PATH, 'utf8');
  const doc = parseYaml(raw) as RequirementsDoc;

  if (!Array.isArray(doc.requirements)) {
    console.error('requirements.yaml: missing or invalid "requirements" array');
    process.exit(1);
  }

  return doc.requirements.map((item) => item.id).sort();
}

function shouldScanFile(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/');
  if (SCAN_ROOTS.some((root) => normalized.startsWith(`${root}/`))) {
    return /\.(ts|tsx)$/.test(normalized);
  }
  return /\.test\.tsx?$/.test(normalized);
}

function walkFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;

    const absolute = path.join(dir, entry);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      walkFiles(absolute, files);
      continue;
    }

    const relative = path.relative(ROOT, absolute);
    if (shouldScanFile(relative)) {
      files.push(relative);
    }
  }

  return files;
}

function collectSourceFiles(): string[] {
  const files = new Set<string>();

  for (const root of SCAN_ROOTS) {
    const absolute = path.join(ROOT, root);
    try {
      statSync(absolute);
    } catch {
      continue;
    }
    for (const file of walkFiles(absolute)) {
      files.add(file);
    }
  }

  for (const file of walkFiles(ROOT)) {
    files.add(file);
  }

  return [...files].sort();
}

function scanAnnotations(files: string[]): Map<string, Set<string>> {
  const refs = new Map<string, Set<string>>();

  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf8');
    for (const match of content.matchAll(REQ_ANNOTATION)) {
      const id = match[1];
      if (!id) continue;
      const locations = refs.get(id) ?? new Set<string>();
      locations.add(file);
      refs.set(id, locations);
    }
  }

  return refs;
}

function rel(file: string): string {
  return file.replace(/\\/g, '/');
}

function main(): void {
  const requiredIds = parseRequirementIds();
  const files = collectSourceFiles();
  const refs = scanAnnotations(files);

  let failed = false;

  console.log('SDD requirement coverage report\n');
  console.log(`Requirements in requirements.yaml: ${requiredIds.length}`);
  console.log(`Source files scanned: ${files.length}\n`);

  for (const id of requiredIds) {
    const locations = refs.get(id);
    const covered = locations !== undefined && locations.size > 0;
    const status = covered ? 'yes' : 'NO';
    console.log(`${id}: ${status}`);
    if (locations && locations.size > 0) {
      const sample = [...locations].sort().slice(0, 5);
      const suffix =
        locations.size > sample.length
          ? ` (+${locations.size - sample.length} more)`
          : '';
      console.log(`  refs: ${sample.map(rel).join(', ')}${suffix}`);
    }
    if (!covered) failed = true;
  }

  const orphanIds = [...refs.keys()]
    .filter((id) => !requiredIds.includes(id))
    .sort();

  if (orphanIds.length > 0) {
    console.log('\nOrphan @req annotations (not in requirements.yaml):');
    for (const id of orphanIds) {
      const locations = refs.get(id);
      console.warn(
        `  ${id}: ${locations ? [...locations].map(rel).join(', ') : ''}`,
      );
    }
    failed = true;
  }

  const coveredCount = requiredIds.filter((id) => refs.has(id)).length;
  console.log(
    `\nCoverage: ${coveredCount}/${requiredIds.length} requirements referenced`,
  );

  if (failed) {
    console.error('\ncheck-coverage: FAILED — unmet or orphan requirements');
    process.exit(1);
  }

  console.log('\ncheck-coverage: OK');
}

main();
