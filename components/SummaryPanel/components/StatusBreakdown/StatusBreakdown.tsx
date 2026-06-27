// @req SCD-SUM-001
import styles from './StatusBreakdown.module.css';

interface StatusBreakdownProps {
  total: number;
  covered: number;
  partial: number;
  missing: number;
}

const StatusBar = ({
  label,
  count,
  total,
  cssVar,
}: {
  label: string;
  count: number;
  total: number;
  cssVar: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.count}>{count}</span>
      <div className={styles.track} role="presentation">
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, backgroundColor: `var(${cssVar})` }}
        />
      </div>
      <span className={styles.pct}>{pct}%</span>
    </div>
  );
};

export const StatusBreakdown = ({
  total,
  covered,
  partial,
  missing,
}: StatusBreakdownProps) => (
  <div className={styles.block}>
    <h3 className={styles.heading}>By status</h3>
    <StatusBar
      label="Covered"
      count={covered}
      total={total}
      cssVar="--status-covered"
    />
    <StatusBar
      label="Partial"
      count={partial}
      total={total}
      cssVar="--status-partial"
    />
    <StatusBar
      label="Missing"
      count={missing}
      total={total}
      cssVar="--status-missing"
    />
  </div>
);
