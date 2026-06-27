// @req SCD-TBL-001
// @req SCD-A11Y-001
// Status indicator using the theme status color plus a text label (never color-only).
import type { CoverageStatus } from '@/lib/api/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: CoverageStatus;
}

const STATUS_LABEL: Record<CoverageStatus, string> = {
  covered: 'Covered',
  partial: 'Partial',
  missing: 'Missing',
};

const STATUS_VAR: Record<CoverageStatus, string> = {
  covered: '--status-covered',
  partial: '--status-partial',
  missing: '--status-missing',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={styles.badge}
    style={{ color: `var(${STATUS_VAR[status]})` }}
  >
    <span
      className={styles.dot}
      style={{ backgroundColor: `var(${STATUS_VAR[status]})` }}
      aria-hidden="true"
    />
    {STATUS_LABEL[status]}
  </span>
);
