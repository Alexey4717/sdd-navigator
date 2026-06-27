// @req SCD-FLT-002
// Single source of truth for mapping URL query params <-> requirements table state.
// Reused by the RSC page (parses `await searchParams`) and the FilterChips client
// component (serializes selections back to the URL). Keeps query/filter naming DRY.

import type { CoverageStatus, RequirementType } from './api/types';
import type { SortKey, SortOrder } from './coverage';

export const REQUIREMENT_TYPES: readonly RequirementType[] = ['FR', 'AR'];
export const COVERAGE_STATUSES: readonly CoverageStatus[] = [
  'covered',
  'partial',
  'missing',
];
const SORT_KEYS: readonly SortKey[] = ['id', 'updatedAt'];
const SORT_ORDERS: readonly SortOrder[] = ['asc', 'desc'];

export const DEFAULT_SORT: SortKey = 'id';
export const DEFAULT_ORDER: SortOrder = 'asc';

export interface TableState {
  type: RequirementType[];
  status: CoverageStatus[];
  sort: SortKey;
  order: SortOrder;
}

// Resolved Next.js searchParams shape (after `await`).
export type RawSearchParams = Record<string, string | string[] | undefined>;

function toRawArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function keepValid<T extends string>(
  raw: readonly string[],
  allowed: readonly T[],
): T[] {
  const set = new Set<string>(allowed);
  // De-duplicate while preserving the canonical option order.
  return allowed.filter(
    (option) => raw.includes(option) && set.has(option),
  ) as T[];
}

function firstValid<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const [raw] = toRawArray(value);
  return raw !== undefined && (allowed as readonly string[]).includes(raw)
    ? (raw as T)
    : fallback;
}

// @req SCD-FLT-002
export function parseTableState(params: RawSearchParams): TableState {
  return {
    type: keepValid(toRawArray(params.type), REQUIREMENT_TYPES),
    status: keepValid(toRawArray(params.status), COVERAGE_STATUSES),
    sort: firstValid(params.sort, SORT_KEYS, DEFAULT_SORT),
    order: firstValid(params.order, SORT_ORDERS, DEFAULT_ORDER),
  };
}

// @req SCD-FLT-002
// Serialize state to URLSearchParams (repeated type/status params, single sort/order).
// Default sort/order are omitted to keep shared URLs clean.
export function stateToSearchParams(state: TableState): URLSearchParams {
  const params = new URLSearchParams();
  for (const type of state.type) params.append('type', type);
  for (const status of state.status) params.append('status', status);
  if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);
  if (state.order !== DEFAULT_ORDER) params.set('order', state.order);
  return params;
}

// @req SCD-SORT-001
// Query string (prefixed with `?` when non-empty) for a sort header link that targets
// `column`: toggles asc/desc when already active, otherwise starts ascending.
export function sortHref(state: TableState, column: SortKey): string {
  const isActive = state.sort === column;
  const order: SortOrder = isActive && state.order === 'asc' ? 'desc' : 'asc';
  const params = stateToSearchParams({ ...state, sort: column, order });
  const query = params.toString();
  // `?` (not empty string) clears default-only params so Link navigation drops `?order=desc`.
  return query ? `?${query}` : '?';
}

// @req SCD-FLT-002
// Current query string (prefixed with `?` when non-empty) used to preserve filters on
// row -> detail navigation.
export function currentQuery(state: TableState): string {
  const query = stateToSearchParams(state).toString();
  return query ? `?${query}` : '';
}
