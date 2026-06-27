// @req SCD-API-001
// Named domain types derived from the generated OpenAPI schema.
// Never hand-redefine these shapes — always import from here.

import type { components } from './schema.d';

export type Stats = components['schemas']['Stats'];
export type RequirementStats = components['schemas']['RequirementStats'];
export type AnnotationStats = components['schemas']['AnnotationStats'];
export type TaskStats = components['schemas']['TaskStats'];

export type Requirement = components['schemas']['Requirement'];
export type RequirementDetail = components['schemas']['RequirementDetail'];
export type Annotation = components['schemas']['Annotation'];
export type Task = components['schemas']['Task'];

export type ScanStatus = components['schemas']['ScanStatus'];
export type Healthcheck = components['schemas']['Healthcheck'];
export type ApiErrorBody = components['schemas']['Error'];

export type RequirementType = components['schemas']['RequirementType'];
export type CoverageStatus = components['schemas']['CoverageStatus'];
export type AnnotationType = components['schemas']['AnnotationType'];
export type TaskStatus = components['schemas']['TaskStatus'];
