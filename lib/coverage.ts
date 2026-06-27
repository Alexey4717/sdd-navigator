// @req SCD-API-001
// Single source of truth for filter / sort / coverage-assessment / orphan logic.
// Pure and framework-agnostic — reused by data providers, components, and tests.

import type {
  Annotation,
  AnnotationType,
  CoverageStatus,
  Requirement,
  RequirementType,
  Stats,
  Task,
  TaskStatus,
} from './api/types';

export type SortKey = 'id' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface RequirementFilter {
  type?: RequirementType | readonly RequirementType[];
  status?: CoverageStatus | readonly CoverageStatus[];
}

export interface AnnotationFilter {
  type?: AnnotationType | readonly AnnotationType[];
  orphans?: boolean;
}

export interface TaskFilter {
  status?: TaskStatus | readonly TaskStatus[];
  orphans?: boolean;
}

function toArray<T>(value: T | readonly T[] | undefined): readonly T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? (value as readonly T[]) : [value as T];
}

function compareBy<T extends { id: string; updatedAt: string }>(
  a: T,
  b: T,
  sort: SortKey,
): number {
  return sort === 'id'
    ? a.id.localeCompare(b.id)
    : a.updatedAt.localeCompare(b.updatedAt);
}

// @req SCD-FLT-001
export function filterRequirements(
  reqs: readonly Requirement[],
  filter: RequirementFilter = {},
): Requirement[] {
  const types = toArray(filter.type);
  const statuses = toArray(filter.status);
  return reqs.filter(
    (r) =>
      (types.length === 0 || types.includes(r.type)) &&
      (statuses.length === 0 || statuses.includes(r.status)),
  );
}

// @req SCD-SORT-001
export function sortRequirements(
  reqs: readonly Requirement[],
  sort: SortKey,
  order: SortOrder,
): Requirement[] {
  const dir = order === 'asc' ? 1 : -1;
  return [...reqs].sort((a, b) => compareBy(a, b, sort) * dir);
}

// @req SCD-DET-001
export function assessCoverage(
  status: CoverageStatus,
): 'Fully covered' | 'Needs tests' | 'Not implemented' {
  switch (status) {
    case 'covered':
      return 'Fully covered';
    case 'partial':
      return 'Needs tests';
    case 'missing':
      return 'Not implemented';
  }
}

// @req SCD-ORPH-001
export function findOrphanAnnotations(
  annotations: readonly Annotation[],
  reqs: readonly Requirement[],
): Annotation[] {
  const ids = new Set(reqs.map((r) => r.id));
  return annotations.filter((a) => !ids.has(a.reqId));
}

// @req SCD-TASK-001
export function findOrphanTasks(
  tasks: readonly Task[],
  reqs: readonly Requirement[],
): Task[] {
  const ids = new Set(reqs.map((r) => r.id));
  return tasks.filter((t) => !ids.has(t.requirementId));
}

// @req SCD-ORPH-001
export function filterAnnotations(
  annotations: readonly Annotation[],
  reqs: readonly Requirement[],
  filter: AnnotationFilter = {},
): Annotation[] {
  const types = toArray(filter.type);
  const byType = annotations.filter(
    (a) => types.length === 0 || types.includes(a.type),
  );
  return filter.orphans === true ? findOrphanAnnotations(byType, reqs) : byType;
}

// @req SCD-TASK-001
export function filterTasks(
  tasks: readonly Task[],
  reqs: readonly Requirement[],
  filter: TaskFilter = {},
): Task[] {
  const statuses = toArray(filter.status);
  const byStatus = tasks.filter(
    (t) => statuses.length === 0 || statuses.includes(t.status),
  );
  return filter.orphans === true ? findOrphanTasks(byStatus, reqs) : byStatus;
}

// @req SCD-TASK-001
export function sortTasks(
  tasks: readonly Task[],
  sort: SortKey,
  order: SortOrder,
): Task[] {
  const dir = order === 'asc' ? 1 : -1;
  return [...tasks].sort((a, b) => compareBy(a, b, sort) * dir);
}

function countBy<T>(
  items: readonly T[],
  key: (item: T) => string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const k = key(item);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

// @req SCD-SUM-001
export function computeStats(
  reqs: readonly Requirement[],
  annotations: readonly Annotation[],
  tasks: readonly Task[],
  lastScanAt: string = new Date().toISOString(),
): Stats {
  const byStatus = countBy(reqs, (r) => r.status);
  const total = reqs.length;
  const covered = byStatus['covered'] ?? 0;

  return {
    requirements: {
      total,
      byType: countBy(reqs, (r) => r.type),
      byStatus,
    },
    annotations: {
      total: annotations.length,
      impl: annotations.filter((a) => a.type === 'impl').length,
      test: annotations.filter((a) => a.type === 'test').length,
      orphans: findOrphanAnnotations(annotations, reqs).length,
    },
    tasks: {
      total: tasks.length,
      byStatus: countBy(tasks, (t) => t.status),
      orphans: findOrphanTasks(tasks, reqs).length,
    },
    coverage: total === 0 ? 0 : (covered / total) * 100,
    lastScanAt,
  };
}
