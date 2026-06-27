// @req SCD-SUM-001
import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: ReactNode;
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <div className={styles.item}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>{value}</dd>
  </div>
);
