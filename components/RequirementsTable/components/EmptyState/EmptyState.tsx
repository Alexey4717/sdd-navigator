// @req SCD-FLT-003
// @req SCD-A11Y-001
// Accessible empty state shown when no requirement matches the active filters.
import Link from 'next/link';
import styles from './EmptyState.module.css';

export const EmptyState = () => (
  <section className={styles.empty} aria-labelledby="requirements-heading">
    <h2 id="requirements-heading" className={styles.heading}>
      Requirements
    </h2>
    <p className={styles.message} role="status">
      No requirements match the current filters.
    </p>
    <Link href="/" className={styles.clear}>
      Clear filters
    </Link>
  </section>
);
