// @req SCD-TBL-001
import { render, screen, within } from '@testing-library/react';
import type { CoverageStatus, Requirement, RequirementType } from '@/lib/api/types';
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

const rows: Requirement[] = [
  {
    id: 'FR-SCAN-001',
    type: 'FR',
    title: 'Parse requirements.yaml',
    description: 'desc',
    status: 'covered',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
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
];

const defaultState = {
  type: [] as RequirementType[],
  status: [] as CoverageStatus[],
  sort: DEFAULT_SORT,
  order: DEFAULT_ORDER,
};

describe('RequirementsTable', () => {
  it('renders one row per requirement', () => {
    render(<RequirementsTable rows={rows} state={defaultState} />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'FR-SCAN-001' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AR-SEC-001' })).toBeInTheDocument();
  });

  it('shows empty state when no rows match filters', () => {
    render(<RequirementsTable rows={[]} state={defaultState} />);
    expect(
      screen.getByText('No requirements match the current filters.'),
    ).toBeInTheDocument();
  });

  it('preserves filter query on detail links', () => {
    render(
      <RequirementsTable
        rows={rows}
        state={{ ...defaultState, type: ['FR'], status: ['covered'] }}
      />,
    );
    expect(screen.getByRole('link', { name: 'FR-SCAN-001' })).toHaveAttribute(
      'href',
      '/requirements/FR-SCAN-001?type=FR&status=covered',
    );
  });
});
