'use client';
// @req SCD-DET-001
// @req SCD-A11Y-001
// @req SCD-FLT-002
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import {
  currentQuery,
  parseTableState,
  rawSearchParamsFromUrl,
} from '@/lib/url-filters';
import styles from './BackLink.module.css';

function subscribeToSearch(onStoreChange: () => void): () => void {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
}

function getSearchSnapshot(): string {
  return window.location.search;
}

function getServerSearchSnapshot(): string {
  return '';
}

interface BackLinkViewProps {
  /** Query string from `currentQuery` — `?type=FR` or empty when no filters active. */
  query: string;
}

const BackLinkView = ({ query }: BackLinkViewProps) => (
  <nav className={styles.nav} aria-label="Back navigation">
    <Link href={`/${query}`} className={styles.link}>
      ← Back to requirements
    </Link>
  </nav>
);

export const BackLink = () => {
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const query = currentQuery(
    parseTableState(rawSearchParamsFromUrl(new URLSearchParams(search))),
  );
  return <BackLinkView query={query} />;
};
