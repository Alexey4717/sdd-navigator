// @req SCD-STATE-001
import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

type SkeletonVariant = 'rect' | 'text' | 'circle';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  className?: string;
}

function toSize(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = ({
  width,
  height,
  variant = 'rect',
  className,
}: SkeletonProps) => {
  const style: CSSProperties = {};
  const w = toSize(width);
  const h = toSize(height);
  if (w !== undefined) style.width = w;
  if (h !== undefined) style.height = h;

  const classNames = [styles.skeleton, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames} style={style} aria-hidden="true" />;
};
