// @req SCD-ORPH-001
// @req SCD-A11Y-001
import type { Annotation } from '@/lib/api/types';
import styles from './AnnotationOrphansList.module.css';

interface AnnotationOrphansListProps {
  orphans: readonly Annotation[];
}

const TYPE_LABEL: Record<Annotation['type'], string> = {
  impl: 'Implementation',
  test: 'Test',
};

export const AnnotationOrphansList = ({
  orphans,
}: AnnotationOrphansListProps) => (
  <section
    className={styles.section}
    aria-labelledby="orphan-annotations-heading"
  >
    <h3 id="orphan-annotations-heading" className={styles.heading}>
      Annotation orphans
      <span className={styles.count}>{orphans.length}</span>
    </h3>

    {orphans.length === 0 ? (
      <p className={styles.empty}>No orphan annotations.</p>
    ) : (
      <table className={styles.table}>
        <caption className={styles.caption}>
          Annotations referencing unknown requirement IDs
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.th}>
              File
            </th>
            <th scope="col" className={styles.th}>
              Line
            </th>
            <th scope="col" className={styles.th}>
              Requirement ID
            </th>
            <th scope="col" className={styles.th}>
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {orphans.map((annotation) => (
            <tr
              key={`${annotation.file}:${annotation.line}`}
              className={styles.row}
            >
              <td className={styles.td} data-label="File">
                <code className={styles.fileCode}>{annotation.file}</code>
              </td>
              <td className={styles.td} data-label="Line">
                {annotation.line}
              </td>
              <td className={styles.td} data-label="Requirement ID">
                <code className={styles.reqCode}>{annotation.reqId}</code>
              </td>
              <td className={styles.td} data-label="Type">
                <span className={styles.typeBadge}>
                  {TYPE_LABEL[annotation.type]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
);
