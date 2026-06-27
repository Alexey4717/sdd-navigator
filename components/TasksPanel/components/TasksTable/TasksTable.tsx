// @req SCD-TASK-001
// @req SCD-RESP-001
// @req SCD-A11Y-001
import Link from 'next/link';
import type { Task, TaskStatus } from '@/lib/api/types';
import styles from './TasksTable.module.css';

interface TasksTableProps {
  rows: readonly Task[];
  orphanTaskIds: ReadonlySet<string>;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

export const TasksTable = ({ rows, orphanTaskIds }: TasksTableProps) => {
  if (rows.length === 0) {
    return (
      <p className={styles.empty} role="status">
        No tasks match the selected filters.
      </p>
    );
  }

  return (
    <table className={styles.table}>
      <caption className={styles.caption}>
        Project tasks. Orphan tasks reference unknown requirements and are
        highlighted.
      </caption>
      <thead>
        <tr>
          <th scope="col" className={styles.th}>
            ID
          </th>
          <th scope="col" className={styles.th}>
            Requirement
          </th>
          <th scope="col" className={styles.th}>
            Title
          </th>
          <th scope="col" className={styles.th}>
            Status
          </th>
          <th scope="col" className={styles.th}>
            Assignee
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((task) => {
          const isOrphan = orphanTaskIds.has(task.id);
          return (
            <tr
              key={task.id}
              className={`${styles.row}${isOrphan ? ` ${styles.rowOrphan}` : ''}`}
            >
              <td className={styles.td} data-label="ID">
                <code className={styles.idCode}>{task.id}</code>
              </td>
              <td className={styles.td} data-label="Requirement">
                {isOrphan ? (
                  <>
                    <span className={styles.reqOrphan}>
                      {task.requirementId}
                    </span>
                    <span className={styles.orphanHint}>
                      Unknown requirement
                    </span>
                  </>
                ) : (
                  <Link
                    href={`/requirements/${task.requirementId}`}
                    className={styles.reqLink}
                  >
                    {task.requirementId}
                  </Link>
                )}
              </td>
              <td className={styles.td} data-label="Title">
                {task.title}
              </td>
              <td className={styles.td} data-label="Status">
                <span className={styles.status}>
                  {STATUS_LABEL[task.status]}
                </span>
              </td>
              <td className={styles.td} data-label="Assignee">
                {task.assignee ?? '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
