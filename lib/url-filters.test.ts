// @req SCD-FLT-002
import type { CoverageStatus, RequirementType } from './api/types';
import {
  currentQuery,
  DEFAULT_ORDER,
  DEFAULT_SORT,
  parseTableState,
  rawSearchParamsFromUrl,
  sortHref,
  stateToSearchParams,
} from './url-filters';

describe('parseTableState', () => {
  it('returns defaults for empty params', () => {
    expect(parseTableState({})).toEqual({
      type: [],
      status: [],
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    });
  });

  it('parses multi-value type and status filters', () => {
    expect(
      parseTableState({
        type: ['FR', 'AR'],
        status: ['missing', 'partial'],
        sort: 'updatedAt',
        order: 'desc',
      }),
    ).toEqual({
      type: ['FR', 'AR'],
      status: ['partial', 'missing'],
      sort: 'updatedAt',
      order: 'desc',
    });
  });

  it('ignores invalid filter values', () => {
    expect(parseTableState({ type: 'INVALID', sort: 'bad', order: 'sideways' }))
      .toEqual({
      type: [],
      status: [],
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    });
  });
});

describe('stateToSearchParams', () => {
  it('omits default sort and order', () => {
    const params = stateToSearchParams({
      type: ['FR'],
      status: [],
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    });
    expect(params.toString()).toBe('type=FR');
  });
});

describe('sortHref', () => {
  const base = {
    type: ['FR'] as RequirementType[],
    status: [] as CoverageStatus[],
    sort: DEFAULT_SORT,
    order: DEFAULT_ORDER,
  };

  it('starts ascending when column is inactive', () => {
    expect(sortHref(base, 'updatedAt')).toBe('?type=FR&sort=updatedAt');
  });

  it('toggles to descending when same column is active ascending', () => {
    expect(
      sortHref({ ...base, sort: 'updatedAt', order: 'asc' }, 'updatedAt'),
    ).toBe('?type=FR&sort=updatedAt&order=desc');
  });

  it('returns query with filters when toggling active id sort to asc', () => {
    expect(sortHref({ ...base, sort: 'id', order: 'desc' }, 'id')).toBe('?type=FR');
  });
});

describe('currentQuery', () => {
  it('returns empty string when no filters active', () => {
    expect(
      currentQuery({
        type: [],
        status: [],
        sort: DEFAULT_SORT,
        order: DEFAULT_ORDER,
      }),
    ).toBe('');
  });

  it('preserves active filters for detail links', () => {
    expect(
      currentQuery({
        type: ['FR'],
        status: ['missing'],
        sort: 'updatedAt',
        order: 'desc',
      }),
    ).toBe('?type=FR&status=missing&sort=updatedAt&order=desc');
  });
});

describe('rawSearchParamsFromUrl', () => {
  it('maps URLSearchParams to RawSearchParams', () => {
    const params = new URLSearchParams('type=FR&type=AR&status=missing');
    expect(rawSearchParamsFromUrl(params)).toEqual({
      type: ['FR', 'AR'],
      status: 'missing',
    });
  });
});
