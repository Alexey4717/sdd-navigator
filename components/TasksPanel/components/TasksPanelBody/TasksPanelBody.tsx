'use client';
// @req SCD-TASK-001
import { useMemo, useState } from 'react';
import type { Requirement, Task, TaskStatus } from '@/lib/api/types';
import { filterTasks } from '@/lib/coverage';
import { TaskStatusFilter } from '../TaskStatusFilter/TaskStatusFilter';
import { TasksTable } from '../TasksTable/TasksTable';
import styles from './TasksPanelBody.module.css';

interface TasksPanelBodyProps {
  tasks: readonly Task[];
  requirements: readonly Requirement[];
  orphanTaskIds: ReadonlySet<string>;
}

export const TasksPanelBody = ({
  tasks,
  requirements,
  orphanTaskIds,
}: TasksPanelBodyProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);

  const rows = useMemo(
    () =>
      filterTasks(tasks, requirements, {
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      }),
    [tasks, requirements, selectedStatuses],
  );

  return (
    <div className={styles.body}>
      <TaskStatusFilter
        selected={selectedStatuses}
        onChange={setSelectedStatuses}
      />
      <TasksTable rows={rows} orphanTaskIds={orphanTaskIds} />
    </div>
  );
};
