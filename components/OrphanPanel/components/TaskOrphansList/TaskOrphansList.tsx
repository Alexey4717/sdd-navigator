// @req SCD-ORPH-001
// @req SCD-A11Y-001
import type { Task } from '@/lib/api/types';
import styles from './TaskOrphansList.module.css';

interface TaskOrphansListProps {
  orphans: readonly Task[];
}

export const TaskOrphansList = ({ orphans }: TaskOrphansListProps) => (
  <section className={styles.section} aria-labelledby="orphan-tasks-heading">
    <h3 id="orphan-tasks-heading" className={styles.heading}>
      Task orphans
      <span className={styles.count}>{orphans.length}</span>
    </h3>

    {orphans.length === 0 ? (
      <p className={styles.empty}>No orphan tasks.</p>
    ) : (
      <table className={styles.table}>
        <caption className={styles.caption}>
          Tasks referencing unknown requirement IDs
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.th}>
              ID
            </th>
            <th scope="col" className={styles.th}>
              Title
            </th>
            <th scope="col" className={styles.th}>
              Requirement ID
            </th>
          </tr>
        </thead>
        <tbody>
          {orphans.map((task) => (
            <tr key={task.id} className={styles.row}>
              <td className={styles.td} data-label="ID">
                <code className={styles.idCode}>{task.id}</code>
              </td>
              <td className={styles.td} data-label="Title">
                {task.title}
              </td>
              <td className={styles.td} data-label="Requirement ID">
                <code className={styles.reqCode}>{task.requirementId}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
);
