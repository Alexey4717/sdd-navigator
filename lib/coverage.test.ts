// @req SCD-API-001
import type { Annotation, Requirement, Task } from './api/types';
import {
  assessCoverage,
  computeStats,
  filterAnnotations,
  filterRequirements,
  filterTasks,
  findOrphanAnnotations,
  findOrphanTasks,
  sortRequirements,
  sortTasks,
} from './coverage';

const requirements: Requirement[] = [
  {
    id: 'FR-SCAN-001',
    type: 'FR',
    title: 'Parse requirements.yaml',
    description: 'desc',
    status: 'covered',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'FR-API-002',
    type: 'FR',
    title: 'Requirement detail',
    description: 'desc',
    status: 'partial',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 'AR-SEC-001',
    type: 'AR',
    title: 'Rate limit',
    description: 'desc',
    status: 'missing',
    createdAt: '2026-02-20T15:00:00Z',
    updatedAt: '2026-02-20T15:00:00Z',
  },
];

const annotations: Annotation[] = [
  {
    file: 'src/a.rs',
    line: 1,
    reqId: 'FR-SCAN-001',
    type: 'impl',
    snippet: '@req FR-SCAN-001',
  },
  {
    file: 'src/legacy.rs',
    line: 10,
    reqId: 'FR-LEGACY-001',
    type: 'impl',
    snippet: '@req FR-LEGACY-001',
  },
  {
    file: 'tests/old.rs',
    line: 5,
    reqId: 'FR-API-099',
    type: 'test',
    snippet: '@req FR-API-099',
  },
];

const tasks: Task[] = [
  {
    id: 'TASK-001',
    requirementId: 'FR-SCAN-001',
    title: 'Implement parser',
    status: 'done',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-20T18:00:00Z',
  },
  {
    id: 'TASK-006',
    requirementId: 'FR-EXPORT-001',
    title: 'CSV export',
    status: 'open',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
];

describe('findOrphanAnnotations', () => {
  it('returns annotations whose reqId is not in requirements', () => {
    const orphans = findOrphanAnnotations(annotations, requirements);
    expect(orphans.map((a) => a.reqId).sort()).toEqual([
      'FR-API-099',
      'FR-LEGACY-001',
    ]);
  });
});

describe('findOrphanTasks', () => {
  it('returns tasks whose requirementId is not in requirements', () => {
    const orphans = findOrphanTasks(tasks, requirements);
    expect(orphans).toHaveLength(1);
    expect(orphans[0]?.id).toBe('TASK-006');
    expect(orphans[0]?.requirementId).toBe('FR-EXPORT-001');
  });
});

describe('computeStats', () => {
  it('returns 0% coverage when no requirements', () => {
    const stats = computeStats([], annotations, tasks);
    expect(stats.coverage).toBe(0);
    expect(stats.requirements.total).toBe(0);
  });

  it('returns 100% coverage when all requirements are covered', () => {
    const allCovered: Requirement[] = requirements.map((r) => ({
      ...r,
      status: 'covered' as const,
    }));
    const stats = computeStats(allCovered, [], []);
    expect(stats.coverage).toBe(100);
  });

  it('returns partial coverage matching mock data ratio', () => {
    const stats = computeStats(requirements, annotations, tasks);
    expect(stats.coverage).toBeCloseTo(33.333, 2);
    expect(stats.annotations.orphans).toBe(2);
    expect(stats.tasks.orphans).toBe(1);
  });
});

describe('assessCoverage', () => {
  it('maps status to human-readable labels', () => {
    expect(assessCoverage('covered')).toBe('Fully covered');
    expect(assessCoverage('partial')).toBe('Needs tests');
    expect(assessCoverage('missing')).toBe('Not implemented');
  });
});

describe('filterRequirements', () => {
  it('filters by type', () => {
    const filtered = filterRequirements(requirements, { type: 'FR' });
    expect(filtered.every((r) => r.type === 'FR')).toBe(true);
    expect(filtered).toHaveLength(2);
  });

  it('filters by status', () => {
    const filtered = filterRequirements(requirements, { status: 'missing' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('AR-SEC-001');
  });

  it('combines type and status filters', () => {
    const filtered = filterRequirements(requirements, {
      type: 'FR',
      status: 'partial',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('FR-API-002');
  });
});

describe('sortRequirements', () => {
  it('sorts by id ascending', () => {
    const sorted = sortRequirements(requirements, 'id', 'asc');
    expect(sorted.map((r) => r.id)).toEqual([
      'AR-SEC-001',
      'FR-API-002',
      'FR-SCAN-001',
    ]);
  });

  it('sorts by updatedAt descending', () => {
    const sorted = sortRequirements(requirements, 'updatedAt', 'desc');
    expect(sorted[0]?.id).toBe('FR-SCAN-001');
    expect(sorted.at(-1)?.id).toBe('AR-SEC-001');
  });
});

describe('filterTasks', () => {
  it('filters by status', () => {
    const filtered = filterTasks(tasks, requirements, { status: 'open' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('TASK-006');
  });

  it('returns only orphan tasks when orphans flag is set', () => {
    const filtered = filterTasks(tasks, requirements, { orphans: true });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.requirementId).toBe('FR-EXPORT-001');
  });
});

describe('filterAnnotations', () => {
  it('returns only orphan annotations when orphans flag is set', () => {
    const filtered = filterAnnotations(annotations, requirements, {
      orphans: true,
    });
    expect(filtered.map((a) => a.reqId).sort()).toEqual([
      'FR-API-099',
      'FR-LEGACY-001',
    ]);
  });
});

describe('sortTasks', () => {
  it('sorts tasks by id', () => {
    const sorted = sortTasks(tasks, 'id', 'asc');
    expect(sorted.map((t) => t.id)).toEqual(['TASK-001', 'TASK-006']);
  });
});
