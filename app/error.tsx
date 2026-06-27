// @req SCD-STATE-001
// Client Component required by Next.js error boundaries (reset needs onClick).
// Cannot import RSC DataError — shares DataError.module.css instead.
'use client';

import { DataError } from '@/components/DataError/DataError';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => (
  <DataError
    message={error.message || 'An unexpected error occurred.'}
    reset={reset}
  />
);

export default ErrorPage;
