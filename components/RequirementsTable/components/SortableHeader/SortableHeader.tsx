// @req SCD-SORT-001
// @req SCD-A11Y-001
// Sortable column header. Renders a real `<a>` link carrying the toggled sort query —
// naturally keyboard-focusable and shareable, no client JS needed. `aria-sort`
// communicates the active sort direction to assistive tech.
import Link from 'next/link';
import type { SortKey } from '@/lib/coverage';
import { sortHref, type TableState } from '@/lib/url-filters';
import styles from './SortableHeader.module.css';

interface SortableHeaderProps {
  column: SortKey;
  label: string;
  state: TableState;
}

export const SortableHeader = ({
  column,
  label,
  state,
}: SortableHeaderProps) => {
  const isActive = state.sort === column;
  const ariaSort: 'ascending' | 'descending' | 'none' = isActive
    ? state.order === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';
  const indicator = isActive ? (state.order === 'asc' ? '▲' : '▼') : '↕';
  const nextDirection =
    isActive && state.order === 'asc' ? 'descending' : 'ascending';

  return (
    <th scope="col" className={styles.th} aria-sort={ariaSort}>
      <Link
        href={sortHref(state, column)}
        className={styles.link}
        data-active={isActive}
        aria-label={`Sort by ${label} ${nextDirection}`}
        scroll={false}
      >
        {label}
        <span className={styles.indicator} aria-hidden="true">
          {indicator}
        </span>
      </Link>
    </th>
  );
};
