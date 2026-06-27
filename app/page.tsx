// @req SCD-SUM-001
// @req SCD-STATE-001
import { getStats } from '@/lib/api';
import { DataError } from '@/components/DataError/DataError';
import { SummaryPanel } from '@/components/SummaryPanel/SummaryPanel';

export default async function HomePage() {
  const result = await getStats();

  if (!result.ok) {
    return <DataError message={result.error.message} />;
  }

  return (
    <div>
      <SummaryPanel stats={result.data} />

      {/* SA5 — RequirementsTable + FilterChips will be added here */}
    </div>
  );
}
