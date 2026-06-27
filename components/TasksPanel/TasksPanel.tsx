// @req SCD-TASK-001
// @req SCD-RESP-001
// @req SCD-A11Y-001
import type { Requirement, Task } from '@/lib/api/types';
import { findOrphanTasks } from '@/lib/coverage';
import { TasksPanelBody } from './components/TasksPanelBody/TasksPanelBody';
import styles from './TasksPanel.module.css';

interface TasksPanelProps {
  tasks: readonly Task[];
  requirements: readonly Requirement[];
}

export const TasksPanel = ({ tasks, requirements }: TasksPanelProps) => {
  const orphanTaskIds = new Set(
    findOrphanTasks(tasks, requirements).map((task) => task.id),
  );

  return (
    <section className={styles.wrapper} aria-labelledby="tasks-panel-heading">
      <h2 id="tasks-panel-heading" className={styles.heading}>
        Tasks
        <span className={styles.count}>{tasks.length}</span>
      </h2>
      <TasksPanelBody
        tasks={tasks}
        requirements={requirements}
        orphanTaskIds={orphanTaskIds}
      />
    </section>
  );
};
