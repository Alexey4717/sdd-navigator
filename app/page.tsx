// @req SCD-SUM-001
// @req SCD-STATE-001
// @req SCD-FLT-002
import { getStats, listRequirements } from '@/lib/api';
import { filterRequirements, sortRequirements } from '@/lib/coverage';
import { parseTableState, type RawSearchParams } from '@/lib/url-filters';
import { DataError } from '@/components/DataError/DataError';
import { SummaryPanel } from '@/components/SummaryPanel/SummaryPanel';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import { RequirementsTable } from '@/components/RequirementsTable/RequirementsTable';
import styles from './page.module.css';

interface HomePageProps {
  // Next.js 16: searchParams is a Promise in async Server Components — awaiting it
  // makes the page dynamic, which is exactly what URL-driven filtering needs.
  searchParams: Promise<RawSearchParams>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const [stats, requirements] = await Promise.all([
    getStats(),
    listRequirements(),
  ]);

  if (!stats.ok) {
    return <DataError message={stats.error.message} />;
  }
  if (!requirements.ok) {
    return <DataError message={requirements.error.message} />;
  }

  // URL is the single source of truth. The REST API only filters by a single
  // type/status, so we fetch the full list and apply MULTI-SELECT filter + sort with
  // the shared coverage functions — uniform for mock/live and DRY.
  const state = parseTableState(await searchParams);
  const rows = sortRequirements(
    filterRequirements(requirements.data, {
      type: state.type,
      status: state.status,
    }),
    state.sort,
    state.order,
  );

  return (
    <div className={styles.stack}>
      <SummaryPanel stats={stats.data} />
      <FilterChips />
      <RequirementsTable rows={rows} state={state} />
    </div>
  );
};

export default HomePage;
