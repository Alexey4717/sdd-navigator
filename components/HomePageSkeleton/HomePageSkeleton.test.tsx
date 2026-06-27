// @req SCD-STATE-001
import { render, screen } from '@testing-library/react';
import { HomePageSkeleton } from './HomePageSkeleton';
import { RequirementDetailSkeleton } from '@/components/RequirementDetailSkeleton/RequirementDetailSkeleton';

describe('HomePageSkeleton', () => {
  it('exposes loading state and mirrors home page sections', () => {
    const { container } = render(<HomePageSkeleton />);

    expect(screen.getByLabelText('Loading dashboard data…')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(container.querySelectorAll('section')).toHaveLength(4);
    expect(
      container.querySelector('[class*="orphanSummary"]'),
    ).toBeInTheDocument();
  });
});

describe('RequirementDetailSkeleton', () => {
  it('exposes loading state with article layout', () => {
    const { container } = render(<RequirementDetailSkeleton />);

    expect(
      screen.getByLabelText('Loading requirement details…'),
    ).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelectorAll('section')).toHaveLength(2);
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelector('[class*="tableWrap"]')).toBeInTheDocument();
  });
});
