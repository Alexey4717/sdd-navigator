// @req SCD-SUM-001
// @req SCD-A11Y-001
// @req SCD-RESP-001
import type { Stats } from '@/lib/api/types';
import styles from './SummaryPanel.module.css';
import { CoverageProgress } from './components/CoverageProgress/CoverageProgress';
import { OrphanWarning } from './components/OrphanWarning/OrphanWarning';
import { StatCard } from './components/StatCard/StatCard';
import { StatusBreakdown } from './components/StatusBreakdown/StatusBreakdown';

interface SummaryPanelProps {
  stats: Stats;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export const SummaryPanel = ({ stats }: SummaryPanelProps) => {
  const { requirements, annotations, tasks, coverage, lastScanAt } = stats;
  const total = requirements.total;
  const covered = requirements.byStatus['covered'] ?? 0;
  const partial = requirements.byStatus['partial'] ?? 0;
  const missing = requirements.byStatus['missing'] ?? 0;
  const fr = requirements.byType['FR'] ?? 0;
  const ar = requirements.byType['AR'] ?? 0;

  return (
    <section className={styles.panel} aria-labelledby="summary-heading">
      <header className={styles.header}>
        <h2 id="summary-heading" className={styles.heading}>
          Coverage Summary
        </h2>
        <time className={styles.scanAt} dateTime={lastScanAt} title="Last scan timestamp">
          Last scan: {formatDate(lastScanAt)}
        </time>
      </header>

      <CoverageProgress value={coverage} />

      <dl className={styles.metaGrid}>
        <StatCard label="Total requirements" value={total} />
        <StatCard label="Functional (FR)" value={fr} />
        <StatCard label="Architectural (AR)" value={ar} />
        <StatCard label="Annotations" value={annotations.total} />
      </dl>

      <StatusBreakdown total={total} covered={covered} partial={partial} missing={missing} />

      <OrphanWarning
        annotationOrphans={annotations.orphans}
        taskOrphans={tasks.orphans}
      />
    </section>
  );
};
