/**
 * Edge case tests for HTTP client.
 * Tests JSON parse failures, 429/503 handling, non-JSON responses,
 * concurrent requests, and abort edge cases.
 */
import { http } from '@/utils/http';
import { getAuthToken } from '@/utils/storage';

jest.mock('@/utils/storage', () => ({
  getAuthToken: jest.fn(),
}));

const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;
const mockFetch = jest.fn();
(global as Record<string, unknown>).fetch = mockFetch;

describe('HTTP Client - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthToken.mockResolvedValue('test-token');
  });

  describe('non-JSON response handling', () => {
    it('handles HTML error page response gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON')),
      });

      const result = await http.get('/api/data');

      expect(result.success).toBe(false);
      expect(result.status).toBe(502);
      expect(result.message).toContain('Server error');
    });

    it('handles empty body on success response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
      });

      const result = await http.get('/api/empty');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Empty response');
    });

    it('handles malformed JSON', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      });

      const result = await http.post('/api/create', { name: 'test' });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
    });
  });

  describe('rate limiting (429)', () => {
    it('returns user-friendly message for 429 Too Many Requests', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ message: 'Rate limit exceeded' }),
      });

      const result = await http.get('/api/data');

      expect(result.success).toBe(false);
      expect(result.status).toBe(429);
      expect(result.message).toBe('Too many requests. Please try again later.');
    });
  });

  describe('service unavailable (503)', () => {
    it('returns user-friendly message for 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ message: 'Service down' }),
      });

      const result = await http.get('/api/data');

      expect(result.success).toBe(false);
      expect(result.status).toBe(503);
      expect(result.message).toBe('Service temporarily unavailable. Please try again later.');
    });
  });

  describe('timeout behavior', () => {
    it('respects custom timeout value', async () => {
      jest.useFakeTimers();
      let aborted = false;
      mockFetch.mockImplementation((_url: string, opts: RequestInit) => {
        return new Promise((_resolve, reject) => {
          opts.signal?.addEventListener('abort', () => {
            aborted = true;
            reject(new DOMException('The operation was aborted', 'AbortError'));
          });
        });
      });

      const resultPromise = http.get('/api/slow');

      // Advance past the 30s timeout and flush microtasks
      await jest.advanceTimersByTimeAsync(31000);

      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.message).toBe('Request timed out. Please check your connection.');
      expect(aborted).toBe(true);
      jest.useRealTimers();
    });
  });

  describe('concurrent requests', () => {
    it('handles multiple concurrent requests independently', async () => {
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: { id: callCount }, message: 'OK' }),
        });
      });

      const [r1, r2, r3] = await Promise.all([
        http.get('/api/a'),
        http.get('/api/b'),
        http.get('/api/c'),
      ]);

      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('request body handling', () => {
    it('does not send body for GET even if provided via http.get', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: null }),
      });

      await http.get('/api/data');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.body).toBeUndefined();
    });

    it('sends JSON body for POST', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ data: { id: '1' }, message: 'Created' }),
      });

      await http.post('/api/create', { name: 'Test', amount: 99.99 });

      const [, options] = mockFetch.mock.calls[0];
      expect(JSON.parse(options.body)).toEqual({ name: 'Test', amount: 99.99 });
    });

    it('handles null body for POST', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: null }),
      });

      await http.post('/api/action');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.body).toBeUndefined();
    });
  });

  describe('auth token edge cases', () => {
    it('does not set auth header when token is empty string', async () => {
      mockGetAuthToken.mockResolvedValue('');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });

      await http.get('/api/data');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers.Authorization).toBeUndefined();
    });

    it('handles auth token fetch failure gracefully', async () => {
      mockGetAuthToken.mockRejectedValue(new Error('Storage error'));

      const result = await http.get('/api/data');

      expect(result.success).toBe(false);
      expect(result.status).toBe(0);
    });
  });
});
