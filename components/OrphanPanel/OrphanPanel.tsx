// @req SCD-ORPH-001
// @req SCD-A11Y-001
import type { Annotation, Requirement, Task } from '@/lib/api/types';
import { findOrphanAnnotations, findOrphanTasks } from '@/lib/coverage';
import { AnnotationOrphansList } from './components/AnnotationOrphansList/AnnotationOrphansList';
import { TaskOrphansList } from './components/TaskOrphansList/TaskOrphansList';
import styles from './OrphanPanel.module.css';

interface OrphanPanelProps {
  annotations: readonly Annotation[];
  tasks: readonly Task[];
  requirements: readonly Requirement[];
}

export const OrphanPanel = ({
  annotations,
  tasks,
  requirements,
}: OrphanPanelProps) => {
  const annotationOrphans = findOrphanAnnotations(annotations, requirements);
  const taskOrphans = findOrphanTasks(tasks, requirements);
  const totalOrphans = annotationOrphans.length + taskOrphans.length;

  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>
        Orphans
        <span className={styles.badge}>{totalOrphans}</span>
      </summary>

      <div className={styles.content}>
        {totalOrphans === 0 ? (
          <p className={styles.emptyAll} role="status">
            No orphan annotations or tasks detected.
          </p>
        ) : (
          <>
            <AnnotationOrphansList orphans={annotationOrphans} />
            <TaskOrphansList orphans={taskOrphans} />
          </>
        )}
      </div>
    </details>
  );
};
