'use client';
// @req SCD-FLT-001
// @req SCD-A11Y-001
// Toggle chip — a real <button> with aria-pressed reflecting selection. Keyboard- and
// focus-visible-operable for free. Optional status color dot keeps status semantics.
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  statusVar?: string;
}

export const Chip = ({ label, pressed, onToggle, statusVar }: ChipProps) => (
  <button
    type="button"
    className={styles.chip}
    aria-pressed={pressed}
    onClick={onToggle}
    data-pressed={pressed}
  >
    {statusVar && (
      <span
        className={styles.dot}
        style={{ backgroundColor: `var(${statusVar})` }}
        aria-hidden="true"
      />
    )}
    {label}
  </button>
);
