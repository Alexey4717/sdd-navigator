// @req SCD-API-001
// Single DataProvider interface implemented by both mock and live providers.
// Filter param types extend the shared coverage filters (DRY) and add list-only
// sort/order options.

import type {
  AnnotationFilter,
  RequirementFilter,
  SortKey,
  SortOrder,
  TaskFilter,
} from '../coverage';
import type { Result } from './errors';
import type {
  Annotation,
  Requirement,
  RequirementDetail,
  ScanStatus,
  Stats,
  Task,
} from './types';

export interface RequirementListFilters extends RequirementFilter {
  sort?: SortKey;
  order?: SortOrder;
}

export type AnnotationListFilters = AnnotationFilter;

export interface TaskListFilters extends TaskFilter {
  sort?: SortKey;
  order?: SortOrder;
}

// @req SCD-API-002
export interface DataProvider {
  getStats(): Promise<Result<Stats>>;
  listRequirements(
    filters?: RequirementListFilters,
  ): Promise<Result<Requirement[]>>;
  getRequirement(id: string): Promise<Result<RequirementDetail>>;
  listAnnotations(
    filters?: AnnotationListFilters,
  ): Promise<Result<Annotation[]>>;
  listTasks(filters?: TaskListFilters): Promise<Result<Task[]>>;
  triggerScan(): Promise<Result<ScanStatus>>;
  getScanStatus(): Promise<Result<ScanStatus>>;
}
