'use client';
// @req SCD-DET-001
// @req SCD-A11Y-001
// @req SCD-FLT-002
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  currentQuery,
  parseTableState,
  rawSearchParamsFromUrl,
} from '@/lib/url-filters';
import styles from './BackLink.module.css';

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

export const BackLinkFallback = () => <BackLinkView query="" />;

export const BackLink = () => {
  const searchParams = useSearchParams();
  const query = currentQuery(
    parseTableState(rawSearchParamsFromUrl(searchParams)),
  );
  return <BackLinkView query={query} />;
};
