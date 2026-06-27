// @req SCD-STATE-001
// @req SCD-A11Y-001
import Link from 'next/link';
import styles from './not-found.module.css';

const RequirementNotFound = () => (
  <section className={styles.block} aria-labelledby="not-found-heading">
    <h1 id="not-found-heading" className={styles.title}>
      Requirement not found
    </h1>
    <p className={styles.message}>
      No requirement matches this ID. It may have been removed or the link is
      incorrect.
    </p>
    <Link href="/" className={styles.link}>
      Back to requirements
    </Link>
  </section>
);

export default RequirementNotFound;
