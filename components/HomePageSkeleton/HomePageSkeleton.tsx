// @req SCD-STATE-001
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from './HomePageSkeleton.module.css';

const TABLE_ROW_COUNT = 8;

export const HomePageSkeleton = () => (
  <div
    className={styles.stack}
    aria-busy="true"
    aria-label="Loading dashboard data…"
  >
    <section className={styles.panel} aria-hidden="true">
      <div className={styles.headerRow}>
        <Skeleton height="1.35rem" width="10rem" />
        <Skeleton height="0.875rem" width="8rem" />
      </div>
      <Skeleton height="0.625rem" width="100%" />
      <div className={styles.metaGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="3.5rem" />
        ))}
      </div>
      <div className={styles.statusBars}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="1.75rem" width="100%" />
        ))}
      </div>
      <Skeleton height="2.5rem" width="100%" />
    </section>

    <section className={styles.chipGroup} aria-hidden="true">
      <div className={styles.chipRow}>
        <Skeleton height="0.75rem" width="2.5rem" />
        <Skeleton height="2rem" width="9rem" />
        <Skeleton height="2rem" width="10rem" />
      </div>
      <div className={styles.chipRow}>
        <Skeleton height="0.75rem" width="3rem" />
        <Skeleton height="2rem" width="5.5rem" />
        <Skeleton height="2rem" width="5.5rem" />
        <Skeleton height="2rem" width="5.5rem" />
      </div>
    </section>

    <section className={styles.tableBlock} aria-hidden="true">
      <Skeleton
        className={styles.sectionHeading}
        height="1.35rem"
        width="9rem"
      />
      <div className={styles.tableRows}>
        <Skeleton height="2rem" width="100%" />
        {Array.from({ length: TABLE_ROW_COUNT }, (_, i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
          </div>
        ))}
      </div>
    </section>

    <section className={styles.tableBlock} aria-hidden="true">
      <Skeleton
        className={styles.sectionHeading}
        height="1.35rem"
        width="5rem"
      />
      <div className={styles.chipRow}>
        <Skeleton height="0.75rem" width="3rem" />
        <Skeleton height="2rem" width="4rem" />
        <Skeleton height="2rem" width="6.5rem" />
        <Skeleton height="2rem" width="4.5rem" />
      </div>
      <div className={styles.tableRows}>
        <Skeleton height="2rem" width="100%" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
          </div>
        ))}
      </div>
    </section>

    <div className={styles.orphanSummary} aria-hidden="true">
      <Skeleton height="1.35rem" width="5rem" />
      <Skeleton height="1.25rem" width="1.75rem" variant="circle" />
    </div>
  </div>
);
