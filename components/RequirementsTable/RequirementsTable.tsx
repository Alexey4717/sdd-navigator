// @req SCD-TBL-001
// @req SCD-RESP-001
// @req SCD-A11Y-001
import Link from 'next/link';
import type { Requirement } from '@/lib/api/types';
import { currentQuery, type TableState } from '@/lib/url-filters';
import styles from './RequirementsTable.module.css';
import { SortableHeader } from './components/SortableHeader/SortableHeader';
import { StatusBadge } from './components/StatusBadge/StatusBadge';
import { EmptyState } from './components/EmptyState/EmptyState';

interface RequirementsTableProps {
  rows: readonly Requirement[];
  state: TableState;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
    new Date(iso),
  );
}

export const RequirementsTable = ({ rows, state }: RequirementsTableProps) => {
  if (rows.length === 0) {
    return <EmptyState />;
  }

  const query = currentQuery(state);

  return (
    <section className={styles.wrapper} aria-labelledby="requirements-heading">
      <h2 id="requirements-heading" className={styles.heading}>
        Requirements
        <span className={styles.count}>{rows.length}</span>
      </h2>

      <table className={styles.table}>
        <caption className={styles.caption}>
          Requirements coverage. Sortable by ID and last updated date.
        </caption>
        <thead>
          <tr>
            <SortableHeader column="id" label="ID" state={state} />
            <th scope="col" className={styles.th}>
              Type
            </th>
            <th scope="col" className={styles.th}>
              Title
            </th>
            <th scope="col" className={styles.th}>
              Status
            </th>
            <SortableHeader column="updatedAt" label="Updated" state={state} />
          </tr>
        </thead>
        <tbody>
          {rows.map((req) => (
            <tr key={req.id} className={styles.row}>
              <td className={styles.td} data-label="ID">
                <Link
                  href={`/requirements/${req.id}${query}`}
                  className={styles.idLink}
                >
                  {req.id}
                </Link>
              </td>
              <td className={styles.td} data-label="Type">
                <span className={styles.type}>{req.type}</span>
              </td>
              <td className={styles.td} data-label="Title">
                {req.title}
              </td>
              <td className={styles.td} data-label="Status">
                <StatusBadge status={req.status} />
              </td>
              <td className={styles.td} data-label="Updated">
                <time dateTime={req.updatedAt}>
                  {formatDate(req.updatedAt)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
