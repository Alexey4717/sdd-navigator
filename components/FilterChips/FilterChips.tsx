'use client';
// @req SCD-FLT-001
// @req SCD-FLT-002
// @req SCD-A11Y-001
// Multi-select filter chips for requirement type and coverage status. State lives in
// the URL (not React state) so views are shareable. Each toggle rewrites the query and
// `router.replace(..., { scroll: false })` updates the URL without polluting history or
// jumping scroll; `router.refresh()` re-fetches the RSC page so the table matches the URL.
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CoverageStatus, RequirementType } from '@/lib/api/types';
import { COVERAGE_STATUSES, REQUIREMENT_TYPES } from '@/lib/url-filters';
import { Chip } from './components/Chip/Chip';
import styles from './FilterChips.module.css';

const TYPE_LABEL: Record<RequirementType, string> = {
  FR: 'Functional',
  AR: 'Architectural',
};

const STATUS_LABEL: Record<CoverageStatus, string> = {
  covered: 'Covered',
  partial: 'Partial',
  missing: 'Missing',
};

export const FilterChips = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = (params: URLSearchParams) => {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
    router.refresh();
  };

  const toggle = (key: 'type' | 'status', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    for (const v of next) params.append(key, v);
    apply(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');
    params.delete('status');
    apply(params);
  };

  const selectedTypes = searchParams.getAll('type');
  const selectedStatuses = searchParams.getAll('status');
  const hasFilters = selectedTypes.length > 0 || selectedStatuses.length > 0;

  return (
    <section className={styles.filters} aria-label="Filter requirements">
      <div className={styles.group} role="group" aria-label="Filter by type">
        <span className={styles.legend} id="filter-type-label">
          Type
        </span>
        {REQUIREMENT_TYPES.map((type) => (
          <Chip
            key={type}
            label={`${TYPE_LABEL[type]} (${type})`}
            pressed={selectedTypes.includes(type)}
            onToggle={() => toggle('type', type)}
          />
        ))}
      </div>

      <div className={styles.group} role="group" aria-label="Filter by status">
        <span className={styles.legend} id="filter-status-label">
          Status
        </span>
        {COVERAGE_STATUSES.map((status) => (
          <Chip
            key={status}
            label={STATUS_LABEL[status]}
            pressed={selectedStatuses.includes(status)}
            onToggle={() => toggle('status', status)}
            statusVar={`--status-${status}`}
          />
        ))}
      </div>

      {hasFilters && (
        <button type="button" className={styles.clear} onClick={clearFilters}>
          Clear filters
        </button>
      )}
    </section>
  );
};
