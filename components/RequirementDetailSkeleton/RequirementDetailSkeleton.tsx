// @req SCD-STATE-001
import { Skeleton } from '@/components/Skeleton/Skeleton';
import styles from './RequirementDetailSkeleton.module.css';

const ANNOTATION_PLACEHOLDERS = [
  { snippetHeight: '3.5rem' },
  { snippetHeight: '2.75rem' },
] as const;

const TASK_ROW_COUNT = 2;

export const RequirementDetailSkeleton = () => (
  <article
    className={styles.article}
    aria-busy="true"
    aria-label="Loading requirement details…"
  >
    <nav className={styles.backNav} aria-hidden="true">
      <Skeleton height="1.25rem" width="11rem" />
    </nav>

    <header className={styles.metaHeader} aria-hidden="true">
      <div className={styles.titleRow}>
        <Skeleton height="1.875rem" width="min(100%, 22rem)" />
        <Skeleton height="1.75rem" width="7.5rem" />
      </div>
      <div className={styles.descriptionBlock}>
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="88%" />
      </div>
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
      <div className={styles.sectionHeading}>
        <Skeleton height="1.125rem" width="9.5rem" />
        <Skeleton height="1.25rem" width="1.75rem" variant="circle" />
      </div>
      <ul className={styles.annotationList}>
        {ANNOTATION_PLACEHOLDERS.map((item, index) => (
          <li key={index} className={styles.annotationItem}>
            <div className={styles.annotationMeta}>
              <Skeleton height="0.875rem" width="min(100%, 14rem)" />
              <Skeleton height="1.25rem" width="5.5rem" />
            </div>
            <div className={styles.annotationSnippet}>
              <Skeleton height={item.snippetHeight} width="100%" />
            </div>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section} aria-hidden="true">
      <div className={styles.sectionHeading}>
        <Skeleton height="1.125rem" width="7rem" />
        <Skeleton height="1.25rem" width="1.75rem" variant="circle" />
      </div>
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <Skeleton height="0.75rem" width="100%" />
          <Skeleton height="0.75rem" width="100%" />
          <Skeleton height="0.75rem" width="100%" />
          <Skeleton height="0.75rem" width="100%" />
          <Skeleton height="0.75rem" width="100%" />
        </div>
        {Array.from({ length: TASK_ROW_COUNT }, (_, i) => (
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
  </article>
);
