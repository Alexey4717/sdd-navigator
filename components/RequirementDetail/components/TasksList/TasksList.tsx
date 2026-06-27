// @req SCD-DET-001
// @req SCD-A11Y-001
import type { Task, TaskStatus } from '@/lib/api/types';
import styles from './TasksList.module.css';

interface TasksListProps {
  tasks: readonly Task[];
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
    new Date(iso),
  );
}

export const TasksList = ({ tasks }: TasksListProps) => (
  <section className={styles.section} aria-labelledby="tasks-heading">
    <h2 id="tasks-heading" className={styles.heading}>
      Linked tasks
      <span className={styles.count}>{tasks.length}</span>
    </h2>

    {tasks.length === 0 ? (
      <p className={styles.empty}>No tasks linked to this requirement.</p>
    ) : (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            Tasks referencing this requirement
          </caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Assignee</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className={styles.td} data-label="ID">
                  <code className={styles.idCode}>{task.id}</code>
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
                <td className={styles.td} data-label="Updated">
                  <time dateTime={task.updatedAt}>
                    {formatDate(task.updatedAt)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
