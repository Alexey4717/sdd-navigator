// @req SCD-STATE-001
// @req SCD-A11Y-001
import styles from './DataError.module.css';

interface DataErrorProps {
  message: string;
  title?: string;
  reset?: () => void;
}

export const DataError = ({
  message,
  title = 'Failed to load dashboard data',
  reset,
}: DataErrorProps) => (
  <div className={styles.block} role="alert" aria-live="assertive">
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.message}>{message}</p>
    {reset && (
      <button type="button" className={styles.retry} onClick={reset}>
        Try again
      </button>
    )}
  </div>
);
