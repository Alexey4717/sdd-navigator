// @req SCD-API-002
// Server-side mock provider: reads data/*.json from a configurable base dir
// (default <cwd>/data) so SA8 can point it at fixtures. All filtering/sorting is
// delegated to lib/coverage.ts. Parse failures and shape mismatches return a
// malformed Result — never a thrown exception.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  filterAnnotations,
  filterRequirements,
  filterTasks,
  sortRequirements,
  sortTasks,
} from '../coverage';
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

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data');

async function readRaw(dir: string, file: string): Promise<Result<string>> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(dir, file), 'utf8');
  } catch (e) {
    return err('malformed', `Failed to read ${file}: ${String(e)}`);
  }
  if (raw.trim() === '') return err('malformed', `${file} is empty`);
  return ok(raw);
}

async function readJsonArray<T>(
  dir: string,
  file: string,
): Promise<Result<T[]>> {
  const rawRes = await readRaw(dir, file);
  if (!rawRes.ok) return rawRes;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawRes.data);
  } catch (e) {
    return err('malformed', `Invalid JSON in ${file}: ${String(e)}`);
  }
  if (!Array.isArray(parsed))
    return err('malformed', `${file} must be a JSON array`);
  return ok(parsed as T[]);
}

async function readJsonObject<T>(
  dir: string,
  file: string,
): Promise<Result<T>> {
  const rawRes = await readRaw(dir, file);
  if (!rawRes.ok) return rawRes;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawRes.data);
  } catch (e) {
    return err('malformed', `Invalid JSON in ${file}: ${String(e)}`);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return err('malformed', `${file} must be a JSON object`);
  }
  return ok(parsed as T);
}

// @req SCD-API-002
export function createMockProvider(
  dataDir: string = DEFAULT_DATA_DIR,
): DataProvider {
  return {
    // @req SCD-SUM-001
    async getStats(): Promise<Result<Stats>> {
      return readJsonObject<Stats>(dataDir, 'stats.json');
    },

    // @req SCD-FLT-001
    async listRequirements(
      filters: RequirementListFilters = {},
    ): Promise<Result<Requirement[]>> {
      const res = await readJsonArray<Requirement>(
        dataDir,
        'requirements.json',
      );
      if (!res.ok) return res;
      let reqs = filterRequirements(res.data, filters);
      if (filters.sort)
        reqs = sortRequirements(reqs, filters.sort, filters.order ?? 'asc');
      return ok(reqs);
    },

    // @req SCD-DET-001
    async getRequirement(id: string): Promise<Result<RequirementDetail>> {
      const reqRes = await readJsonArray<Requirement>(
        dataDir,
        'requirements.json',
      );
      if (!reqRes.ok) return reqRes;
      const req = reqRes.data.find((r) => r.id === id);
      if (!req) return err('not_found', `Requirement '${id}' not found`, 404);

      const annRes = await readJsonArray<Annotation>(
        dataDir,
        'annotations.json',
      );
      if (!annRes.ok) return annRes;
      const taskRes = await readJsonArray<Task>(dataDir, 'tasks.json');
      if (!taskRes.ok) return taskRes;

      const detail: RequirementDetail = {
        ...req,
        annotations: annRes.data.filter((a) => a.reqId === id),
        tasks: taskRes.data.filter((t) => t.requirementId === id),
      };
      return ok(detail);
    },

    // @req SCD-ORPH-001
    async listAnnotations(
      filters: AnnotationListFilters = {},
    ): Promise<Result<Annotation[]>> {
      const annRes = await readJsonArray<Annotation>(
        dataDir,
        'annotations.json',
      );
      if (!annRes.ok) return annRes;
      const reqRes = await readJsonArray<Requirement>(
        dataDir,
        'requirements.json',
      );
      if (!reqRes.ok) return reqRes;
      return ok(filterAnnotations(annRes.data, reqRes.data, filters));
    },

    // @req SCD-TASK-001
    async listTasks(filters: TaskListFilters = {}): Promise<Result<Task[]>> {
      const taskRes = await readJsonArray<Task>(dataDir, 'tasks.json');
      if (!taskRes.ok) return taskRes;
      const reqRes = await readJsonArray<Requirement>(
        dataDir,
        'requirements.json',
      );
      if (!reqRes.ok) return reqRes;
      let tasks = filterTasks(taskRes.data, reqRes.data, filters);
      if (filters.sort)
        tasks = sortTasks(tasks, filters.sort, filters.order ?? 'asc');
      return ok(tasks);
    },

    // @req SCD-API-002
    async triggerScan(): Promise<Result<ScanStatus>> {
      return ok({ status: 'scanning', startedAt: new Date().toISOString() });
    },

    // @req SCD-SUM-001
    async getScanStatus(): Promise<Result<ScanStatus>> {
      const statsRes = await readJsonObject<Stats>(dataDir, 'stats.json');
      const at = statsRes.ok
        ? statsRes.data.lastScanAt
        : new Date().toISOString();
      return ok({ status: 'completed', startedAt: at, completedAt: at });
    },
  };
}
