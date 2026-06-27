// @req SCD-SUM-001
import { render, screen } from '@testing-library/react';
import { SummaryPanel } from './SummaryPanel';
import type { Stats } from '@/lib/api/types';

const stats: Stats = {
  requirements: {
    total: 8,
    byType: { FR: 6, AR: 2 },
    byStatus: { covered: 5, partial: 1, missing: 2 },
  },
  annotations: { total: 16, impl: 10, test: 6, orphans: 2 },
  tasks: {
    total: 6,
    byStatus: { open: 3, in_progress: 1, done: 2 },
    orphans: 1,
  },
  coverage: 62.5,
  lastScanAt: '2026-03-01T10:15:00Z',
};

describe('SummaryPanel', () => {
  it('shows requirement, annotation, and task totals from stats', () => {
    render(<SummaryPanel stats={stats} />);

    expect(
      screen.getByRole('heading', { name: /coverage summary/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Total requirements')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Annotations')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: /overall coverage 63%/i }),
    ).toBeInTheDocument();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('2 orphan annotations');
    expect(alert).toHaveTextContent('1 orphan task');
  });
});
