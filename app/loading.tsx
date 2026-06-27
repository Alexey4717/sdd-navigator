// @req SCD-STATE-001
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Loading dashboard data…">
      <Skeleton height="2.5rem" width="60%" />
      <Skeleton height="0.625rem" width="100%" />
      <div className={styles.gridRow}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="5rem" />
        ))}
      </div>
      <Skeleton height="6rem" width="100%" />
    </div>
  );
}
