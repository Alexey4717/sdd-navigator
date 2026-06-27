// @req SCD-API-003
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Result } from '../lib/api/errors';
import { err, ok } from '../lib/api/errors';

/** SA9 prep: safe YAML parse returning Result (no throw). */
function parseYamlSafe(content: string): Result<unknown> {
  try {
    return ok(parseYaml(content));
  } catch (e) {
    return err('malformed', `Invalid YAML: ${String(e)}`);
  }
}

const FIXTURES = path.join(process.cwd(), 'tests/fixtures/malformed-yaml');

describe('requirements YAML parse (SA9 prep)', () => {
  it('parses valid requirements.yaml from repo root', () => {
    const raw = readFileSync(
      path.join(process.cwd(), 'requirements.yaml'),
      'utf8',
    );
    const result = parseYamlSafe(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const doc = result.data as { requirements: { id: string }[] };
      expect(doc.requirements.length).toBeGreaterThanOrEqual(17);
    }
  });

  it('returns malformed Result for invalid YAML fixture', () => {
    const raw = readFileSync(path.join(FIXTURES, 'bad.yaml'), 'utf8');
    const result = parseYamlSafe(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('malformed');
      expect(result.error.message).toMatch(/Invalid YAML/);
    }
  });
});
