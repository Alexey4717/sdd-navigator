// @req SCD-DET-001
// @req SCD-A11Y-001
import type { Annotation } from '@/lib/api/types';
import styles from './AnnotationsList.module.css';

interface AnnotationsListProps {
  annotations: readonly Annotation[];
}

const TYPE_LABEL: Record<Annotation['type'], string> = {
  impl: 'Implementation',
  test: 'Test',
};

export const AnnotationsList = ({ annotations }: AnnotationsListProps) => (
  <section className={styles.section} aria-labelledby="annotations-heading">
    <h2 id="annotations-heading" className={styles.heading}>
      Linked annotations
      <span className={styles.count}>{annotations.length}</span>
    </h2>

    {annotations.length === 0 ? (
      <p className={styles.empty}>No annotations linked to this requirement.</p>
    ) : (
      <ul className={styles.list}>
        {annotations.map((annotation) => (
          <li
            key={`${annotation.file}:${annotation.line}`}
            className={styles.item}
          >
            <div className={styles.meta}>
              <span className={styles.file}>
                <code>{annotation.file}</code>
                <span className={styles.line}>line {annotation.line}</span>
              </span>
              <span className={styles.typeBadge}>
                {TYPE_LABEL[annotation.type]}
              </span>
            </div>
            <pre className={styles.pre}>
              <code className={styles.code}>{annotation.snippet}</code>
            </pre>
          </li>
        ))}
      </ul>
    )}
  </section>
);
