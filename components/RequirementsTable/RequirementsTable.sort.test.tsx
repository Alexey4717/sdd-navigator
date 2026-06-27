// @req SCD-SORT-001
import { render, screen, within } from '@testing-library/react';
import type { Requirement } from '@/lib/api/types';
import { sortRequirements } from '@/lib/coverage';
import { DEFAULT_ORDER, DEFAULT_SORT } from '@/lib/url-filters';
import { RequirementsTable } from './RequirementsTable';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const unsorted: Requirement[] = [
  {
    id: 'FR-API-002',
    type: 'FR',
    title: 'Detail endpoint',
    description: 'desc',
    status: 'partial',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 'AR-SEC-001',
    type: 'AR',
    title: 'Rate limit',
    description: 'desc',
    status: 'missing',
    createdAt: '2026-02-20T15:00:00Z',
    updatedAt: '2026-02-20T15:00:00Z',
  },
  {
    id: 'FR-SCAN-001',
    type: 'FR',
    title: 'Parse YAML',
    description: 'desc',
    status: 'covered',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
  },
];

describe('RequirementsTable sort order', () => {
  it('renders rows in sorted id order when given sorted props', () => {
    const sorted = sortRequirements(unsorted, 'id', 'asc');
    render(
      <RequirementsTable
        rows={sorted}
        state={{ type: [], status: [], sort: 'id', order: 'asc' }}
      />,
    );

    const tbody = screen.getAllByRole('rowgroup')[1];
    const links = within(tbody!).getAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual([
      'AR-SEC-001',
      'FR-API-002',
      'FR-SCAN-001',
    ]);
  });

  it('marks active sort column with aria-sort ascending', () => {
    render(
      <RequirementsTable
        rows={unsorted}
        state={{
          type: [],
          status: [],
          sort: DEFAULT_SORT,
          order: DEFAULT_ORDER,
        }}
      />,
    );
    const idHeader = screen.getByRole('columnheader', { name: /^id/i });
    expect(idHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('renders rows in updatedAt descending order when given sorted props', () => {
    const sorted = sortRequirements(unsorted, 'updatedAt', 'desc');
    render(
      <RequirementsTable
        rows={sorted}
        state={{ type: [], status: [], sort: 'updatedAt', order: 'desc' }}
      />,
    );

    const tbody = screen.getAllByRole('rowgroup')[1];
    const links = within(tbody!).getAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual([
      'FR-SCAN-001',
      'FR-API-002',
      'AR-SEC-001',
    ]);
  });
});
