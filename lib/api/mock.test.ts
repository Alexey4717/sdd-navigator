// @req SCD-API-002
import path from 'node:path';
import { createMockProvider } from './mock';

const DATA_DIR = path.join(process.cwd(), 'data');
const EMPTY_DIR = path.join(process.cwd(), 'tests/fixtures/empty');
const MALFORMED_DIR = path.join(process.cwd(), 'tests/fixtures/malformed');
const EMPTY_FILE_DIR = path.join(process.cwd(), 'tests/fixtures/empty-file');

describe('createMockProvider — valid data', () => {
  const provider = createMockProvider(DATA_DIR);

  it('loads stats from data/', async () => {
    const result = await provider.getStats();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.requirements.total).toBe(8);
      expect(result.data.coverage).toBe(62.5);
      expect(result.data.annotations.orphans).toBe(2);
      expect(result.data.tasks.orphans).toBe(1);
    }
  });

  it('lists all requirements', async () => {
    const result = await provider.listRequirements();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toHaveLength(8);
  });

  it('returns requirement detail with linked annotations and tasks', async () => {
    const result = await provider.getRequirement('FR-SCAN-001');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.annotations.length).toBeGreaterThan(0);
      expect(result.data.tasks.some((t) => t.id === 'TASK-001')).toBe(true);
    }
  });

  it('returns not_found for unknown requirement id', async () => {
    const result = await provider.getRequirement('NOPE-999');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
      expect(result.error.status).toBe(404);
    }
  });
});

describe('createMockProvider — malformed JSON', () => {
  const provider = createMockProvider(MALFORMED_DIR);

  it('returns malformed error without throwing', async () => {
    const result = await provider.listRequirements();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('malformed');
      expect(result.error.message).toMatch(/Invalid JSON/);
    }
  });
});

describe('createMockProvider — empty arrays', () => {
  const provider = createMockProvider(EMPTY_DIR);

  it('returns empty requirement list gracefully', async () => {
    const result = await provider.listRequirements();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it('loads zero-coverage stats from empty fixture', async () => {
    const result = await provider.getStats();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.requirements.total).toBe(0);
      expect(result.data.coverage).toBe(0);
    }
  });
});

describe('createMockProvider — empty file', () => {
  const provider = createMockProvider(EMPTY_FILE_DIR);

  it('returns malformed error for whitespace-only file', async () => {
    const result = await provider.listRequirements();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('malformed');
      expect(result.error.message).toMatch(/empty/);
    }
  });
});
