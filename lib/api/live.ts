// @req SCD-API-002
// Live provider: fetches from NEXT_PUBLIC_API_URL. Every expected failure is
// mapped to a typed Result — thrown fetch errors become 'network', 404 becomes
// 'not_found', other non-ok responses become 'http', and JSON parse failures
// become 'malformed'. No exception escapes.

import { err, ok, type Result } from './errors';
import type {
  DataProvider,
  AnnotationListFilters,
  RequirementListFilters,
  TaskListFilters,
} from './provider';
import type {
  Annotation,
  Requirement,
  RequirementDetail,
  ScanStatus,
  Stats,
  Task,
} from './types';

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<Result<T>> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, init);
  } catch (e) {
    return err('network', `Network request failed for ${path}: ${String(e)}`);
  }
  if (res.status === 404) return err('not_found', `Resource not found: ${path}`, 404);
  if (!res.ok) return err('http', `HTTP ${res.status} ${res.statusText} for ${path}`, res.status);
  try {
    return ok((await res.json()) as T);
  } catch (e) {
    return err('malformed', `Failed to parse JSON for ${path}: ${String(e)}`);
  }
}

function appendValues(
  params: URLSearchParams,
  key: string,
  value: string | readonly string[] | undefined,
): void {
  if (value === undefined) return;
  const values = Array.isArray(value) ? value : [value as string];
  for (const v of values) params.append(key, v);
}

function withQuery(path: string, params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function requirementQuery(filters: RequirementListFilters): URLSearchParams {
  const p = new URLSearchParams();
  appendValues(p, 'type', filters.type);
  appendValues(p, 'status', filters.status);
  if (filters.sort) p.set('sort', filters.sort);
  if (filters.order) p.set('order', filters.order);
  return p;
}

function annotationQuery(filters: AnnotationListFilters): URLSearchParams {
  const p = new URLSearchParams();
  appendValues(p, 'type', filters.type);
  if (filters.orphans) p.set('orphans', 'true');
  return p;
}

function taskQuery(filters: TaskListFilters): URLSearchParams {
  const p = new URLSearchParams();
  appendValues(p, 'status', filters.status);
  if (filters.orphans) p.set('orphans', 'true');
  if (filters.sort) p.set('sort', filters.sort);
  if (filters.order) p.set('order', filters.order);
  return p;
}

// @req SCD-API-002
export function createLiveProvider(baseUrl: string): DataProvider {
  return {
    // @req SCD-SUM-001
    getStats: () => request<Stats>(baseUrl, '/stats'),

    // @req SCD-FLT-001
    listRequirements: (filters: RequirementListFilters = {}) =>
      request<Requirement[]>(baseUrl, withQuery('/requirements', requirementQuery(filters))),

    // @req SCD-DET-001
    getRequirement: (id: string) =>
      request<RequirementDetail>(baseUrl, `/requirements/${encodeURIComponent(id)}`),

    // @req SCD-ORPH-001
    listAnnotations: (filters: AnnotationListFilters = {}) =>
      request<Annotation[]>(baseUrl, withQuery('/annotations', annotationQuery(filters))),

    // @req SCD-TASK-001
    listTasks: (filters: TaskListFilters = {}) =>
      request<Task[]>(baseUrl, withQuery('/tasks', taskQuery(filters))),

    // @req SCD-API-002
    triggerScan: () => request<ScanStatus>(baseUrl, '/scan', { method: 'POST' }),

    // @req SCD-SUM-001
    getScanStatus: () => request<ScanStatus>(baseUrl, '/scan'),
  };
}
