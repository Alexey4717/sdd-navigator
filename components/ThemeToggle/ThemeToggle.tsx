'use client';
// @req SCD-THEME-001

import { useCallback, useSyncExternalStore } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_CHANGE = 'sdd-theme-change';

function getSnapshot(): Theme {
  const val = document.documentElement.dataset['theme'];
  return val === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(THEME_CHANGE, callback);
  return () => window.removeEventListener(THEME_CHANGE, callback);
}

export const ThemeToggle = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be unavailable in private browsing
    }
    window.dispatchEvent(new Event(THEME_CHANGE));
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span className={styles.label}>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};
