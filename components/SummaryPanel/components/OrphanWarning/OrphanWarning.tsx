// @req SCD-SUM-001
// @req SCD-A11Y-001
import styles from './OrphanWarning.module.css';

interface OrphanWarningProps {
  annotationOrphans: number;
  taskOrphans: number;
}

export const OrphanWarning = ({
  annotationOrphans,
  taskOrphans,
}: OrphanWarningProps) => {
  if (annotationOrphans <= 0 && taskOrphans <= 0) return null;

  return (
    <div className={styles.block} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        ⚠
      </span>
      <span className={styles.label}>Orphan warnings</span>
      <ul className={styles.list}>
        {annotationOrphans > 0 && (
          <li>
            <strong>{annotationOrphans}</strong> orphan annotation
            {annotationOrphans !== 1 ? 's' : ''} (no matching requirement)
          </li>
        )}
        {taskOrphans > 0 && (
          <li>
            <strong>{taskOrphans}</strong> orphan task
            {taskOrphans !== 1 ? 's' : ''} (no matching requirement)
          </li>
        )}
      </ul>
    </div>
  );
};
