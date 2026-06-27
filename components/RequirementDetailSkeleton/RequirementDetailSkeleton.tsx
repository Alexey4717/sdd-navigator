// @req SCD-STATE-001
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from './RequirementDetailSkeleton.module.css';

export const RequirementDetailSkeleton = () => (
  <article
    className={styles.article}
    aria-busy="true"
    aria-label="Loading requirement details…"
  >
    <Skeleton height="1rem" width="8rem" aria-hidden="true" />

    <header className={styles.section} aria-hidden="true">
      <div className={styles.titleRow}>
        <Skeleton height="1.75rem" width="min(100%, 24rem)" />
        <Skeleton height="1.5rem" width="7rem" />
      </div>
      <Skeleton height="1rem" width="100%" />
      <Skeleton height="1rem" width="85%" />
      <dl className={styles.metaGrid}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.metaItem}>
            <Skeleton height="0.75rem" width="3.5rem" />
            <Skeleton height="1rem" width="100%" />
          </div>
        ))}
      </dl>
    </header>

    <section className={styles.section} aria-hidden="true">
      <Skeleton height="1.125rem" width="10rem" />
      <div className={styles.tableRows}>
        <Skeleton height="2rem" width="100%" />
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
          </div>
        ))}
      </div>
    </section>

    <section className={styles.section} aria-hidden="true">
      <Skeleton height="1.125rem" width="7rem" />
      <div className={styles.tableRows}>
        <Skeleton height="2rem" width="100%" />
        {[1, 2].map((i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="100%" />
          </div>
        ))}
      </div>
    </section>
  </article>
);
