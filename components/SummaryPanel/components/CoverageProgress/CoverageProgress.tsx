// @req SCD-SUM-001
// @req SCD-A11Y-001
import styles from './CoverageProgress.module.css';

interface CoverageProgressProps {
  value: number;
  label?: string;
}

export const CoverageProgress = ({
  value,
  label = 'Overall coverage',
}: CoverageProgressProps) => {
  const pct = Math.round(value);
  return (
    <div className={styles.block}>
      <div className={styles.label}>
        <span>{label}</span>
        <strong className={styles.pct}>{pct}%</strong>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${pct}%`}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
