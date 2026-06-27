// @req SCD-DET-001
// @req SCD-A11Y-001
import type { RequirementDetail } from '@/lib/api/types';
import { assessCoverage } from '@/lib/coverage';
import { StatusBadge } from '@/components/RequirementsTable/components/StatusBadge/StatusBadge';
import styles from './RequirementMeta.module.css';

interface RequirementMetaProps {
  requirement: RequirementDetail;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export const RequirementMeta = ({ requirement }: RequirementMetaProps) => {
  const assessment = assessCoverage(requirement.status);

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{requirement.title}</h1>
        <span className={styles.assessment} aria-label="Coverage assessment">
          {assessment}
        </span>
      </div>

      <p className={styles.description}>{requirement.description}</p>

      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt>ID</dt>
          <dd>
            <code className={styles.code}>{requirement.id}</code>
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Type</dt>
          <dd>{requirement.type}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={requirement.status} />
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Created</dt>
          <dd>
            <time dateTime={requirement.createdAt}>
              {formatDate(requirement.createdAt)}
            </time>
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Updated</dt>
          <dd>
            <time dateTime={requirement.updatedAt}>
              {formatDate(requirement.updatedAt)}
            </time>
          </dd>
        </div>
      </dl>
    </header>
  );
};
