// @req SCD-FLT-001
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_ORDER, DEFAULT_SORT } from '@/lib/url-filters';
import { FilterChips } from './FilterChips';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, refresh }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('FilterChips', () => {
  beforeEach(() => {
    replace.mockClear();
    refresh.mockClear();
  });

  it('toggles type filter and updates URL via router.replace', async () => {
    const user = userEvent.setup();
    render(
      <FilterChips
        state={{ type: [], status: [], sort: DEFAULT_SORT, order: DEFAULT_ORDER }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /functional \(FR\)/i }));

    expect(replace).toHaveBeenCalledWith('/?type=FR', { scroll: false });
    expect(refresh).toHaveBeenCalled();
  });

  it('deselects active type chip on second click', async () => {
    const user = userEvent.setup();
    render(
      <FilterChips
        state={{
          type: ['FR'],
          status: [],
          sort: DEFAULT_SORT,
          order: DEFAULT_ORDER,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /functional \(FR\)/i }));

    expect(replace).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('shows clear filters when any chip is selected', () => {
    render(
      <FilterChips
        state={{
          type: ['FR'],
          status: ['missing'],
          sort: DEFAULT_SORT,
          order: DEFAULT_ORDER,
        }}
      />,
    );

    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });
});
