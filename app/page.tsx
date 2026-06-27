// @req SCD-SUM-001
// @req SCD-STATE-001
// @req SCD-FLT-002
// @req SCD-TASK-001
// @req SCD-ORPH-001
import {
  getStats,
  listAnnotations,
  listRequirements,
  listTasks,
} from '@/lib/api';
import { filterRequirements, sortRequirements } from '@/lib/coverage';
import { parseTableState, type RawSearchParams } from '@/lib/url-filters';
import { DataError } from '@/components/DataError/DataError';
import { SummaryPanel } from '@/components/SummaryPanel/SummaryPanel';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import { RequirementsTable } from '@/components/RequirementsTable/RequirementsTable';
import { TasksPanel } from '@/components/TasksPanel/TasksPanel';
import { OrphanPanel } from '@/components/OrphanPanel/OrphanPanel';
import styles from './page.module.css';

interface HomePageProps {
  // Next.js 16: searchParams is a Promise in async Server Components — awaiting it
  // makes the page dynamic, which is exactly what URL-driven filtering needs.
  searchParams: Promise<RawSearchParams>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const [stats, requirements, tasks, annotations] = await Promise.all([
    getStats(),
    listRequirements(),
    listTasks(),
    listAnnotations(),
  ]);

  if (!stats.ok) {
    return <DataError message={stats.error.message} />;
  }
  if (!requirements.ok) {
    return <DataError message={requirements.error.message} />;
  }
  if (!tasks.ok) {
    return <DataError message={tasks.error.message} />;
  }
  if (!annotations.ok) {
    return <DataError message={annotations.error.message} />;
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
      <FilterChips state={state} />
      <RequirementsTable rows={rows} state={state} />
      <TasksPanel tasks={tasks.data} requirements={requirements.data} />
      <OrphanPanel
        annotations={annotations.data}
        tasks={tasks.data}
        requirements={requirements.data}
      />
    </div>
  );
};

export default HomePage;
