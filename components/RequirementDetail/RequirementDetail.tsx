// @req SCD-DET-001
// @req SCD-A11Y-001
import type { RequirementDetail as RequirementDetailData } from '@/lib/api/types';
import styles from './RequirementDetail.module.css';
import { BackLink } from './components/BackLink/BackLink';
import { RequirementMeta } from './components/RequirementMeta/RequirementMeta';
import { AnnotationsList } from './components/AnnotationsList/AnnotationsList';
import { TasksList } from './components/TasksList/TasksList';

interface RequirementDetailProps {
  requirement: RequirementDetailData;
}

export const RequirementDetail = ({ requirement }: RequirementDetailProps) => (
  <article className={styles.article}>
    <BackLink />
    <RequirementMeta requirement={requirement} />
    <AnnotationsList annotations={requirement.annotations} />
    <TasksList tasks={requirement.tasks} />
  </article>
);
