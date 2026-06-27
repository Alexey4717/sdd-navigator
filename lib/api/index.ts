// @req SCD-API-002
// Public data-layer entrypoint. Selects the live provider when NEXT_PUBLIC_API_URL
// is set, otherwise falls back to the mock provider (dev default). The rest of the
// app imports the bound functions and filter types from here.

import { createLiveProvider } from './live';
import { createMockProvider } from './mock';
import type {
  DataProvider,
  AnnotationListFilters,
  RequirementListFilters,
  TaskListFilters,
} from './provider';

// @req SCD-API-002
function selectProvider(): DataProvider {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return baseUrl ? createLiveProvider(baseUrl) : createMockProvider();
}

const provider = selectProvider();

// @req SCD-SUM-001
export const getStats = () => provider.getStats();

// @req SCD-FLT-001
export const listRequirements = (filters?: RequirementListFilters) =>
  provider.listRequirements(filters);

// @req SCD-DET-001
export const getRequirement = (id: string) => provider.getRequirement(id);

// @req SCD-ORPH-001
export const listAnnotations = (filters?: AnnotationListFilters) =>
  provider.listAnnotations(filters);

// @req SCD-TASK-001
export const listTasks = (filters?: TaskListFilters) =>
  provider.listTasks(filters);

// @req SCD-API-002
export const triggerScan = () => provider.triggerScan();

// @req SCD-SUM-001
export const getScanStatus = () => provider.getScanStatus();

export type { Result, ApiError, ApiErrorKind } from './errors';
export type {
  DataProvider,
  RequirementListFilters,
  AnnotationListFilters,
  TaskListFilters,
} from './provider';
