'use client';
// @req SCD-TASK-001
// @req SCD-A11Y-001
// Client-side multi-select status filter for the tasks panel. Local React state
// (not URL-synced) — task filtering is secondary to requirements table filters
// and avoids extra query-param complexity on the home page for SA7.
import type { TaskStatus } from '@/lib/api/types';
import { Chip } from '@/components/FilterChips/components/Chip/Chip';
import styles from './TaskStatusFilter.module.css';

const TASK_STATUSES: readonly TaskStatus[] = ['open', 'in_progress', 'done'];

const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

interface TaskStatusFilterProps {
  selected: readonly TaskStatus[];
  onChange: (statuses: TaskStatus[]) => void;
}

export const TaskStatusFilter = ({
  selected,
  onChange,
}: TaskStatusFilterProps) => {
  const toggle = (status: TaskStatus) => {
    const next = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];
    onChange(next);
  };

  const clear = () => onChange([]);

  return (
    <div
      className={styles.filter}
      role="group"
      aria-label="Filter tasks by status"
    >
      <span className={styles.legend}>Status</span>
      <div className={styles.chips}>
        {TASK_STATUSES.map((status) => (
          <Chip
            key={status}
            label={STATUS_LABEL[status]}
            pressed={selected.includes(status)}
            onToggle={() => toggle(status)}
          />
        ))}
      </div>
      {selected.length > 0 && (
        <button type="button" className={styles.clear} onClick={clear}>
          Clear
        </button>
      )}
    </div>
  );
};
