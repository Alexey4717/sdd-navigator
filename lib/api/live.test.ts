// @req SCD-API-003
import { createLiveProvider } from './live';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('createLiveProvider error mapping', () => {
  const baseUrl = 'https://api.example.test';

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps network failures to network Result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('connection refused')),
    );
    const result = await createLiveProvider(baseUrl).getStats();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('network');
      expect(result.error.message).toMatch(/connection refused/);
    }
  });

  it('maps 404 to not_found Result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );
    const result = await createLiveProvider(baseUrl).getRequirement('MISSING');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
      expect(result.error.status).toBe(404);
    }
  });

  it('maps non-ok HTTP status to http Result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Server Error', { status: 500 })),
    );
    const result = await createLiveProvider(baseUrl).getStats();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('http');
      expect(result.error.status).toBe(500);
    }
  });

  it('maps invalid JSON body to malformed Result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not-json', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const result = await createLiveProvider(baseUrl).getStats();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe('malformed');
  });

  it('returns parsed data on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          requirements: {
            total: 1,
            byType: { FR: 1 },
            byStatus: { covered: 1 },
          },
          annotations: { total: 0, impl: 0, test: 0, orphans: 0 },
          tasks: { total: 0, byStatus: {}, orphans: 0 },
          coverage: 100,
          lastScanAt: '2026-01-01T00:00:00Z',
        }),
      ),
    );
    const result = await createLiveProvider(baseUrl).getStats();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.coverage).toBe(100);
  });
});
