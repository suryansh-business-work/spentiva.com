/**
 * Deep-level HTTP client tests.
 * Tests auth header injection, error handling, network failures,
 * and response parsing edge cases.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from '@/utils/http';

// Mock global fetch
const mockFetch = jest.fn();
(global as Record<string, unknown>).fetch = mockFetch;

describe('HTTP Client - Deep Level Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('Auth header injection', () => {
    it('includes auth token when available', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('bearer-token');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });

      await http.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer bearer-token',
          }),
        })
      );
    });

    it('does not include auth header when no token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });

      await http.get('/test');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response handling', () => {
    it('returns success with data on 200', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { id: '1' }, message: 'Found' }),
      });

      const result = await http.get<{ id: string }>('/item/1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1' });
      expect(result.status).toBe(200);
    });

    it('returns failure on non-OK response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      const result = await http.get('/missing');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not found');
      expect(result.status).toBe(404);
    });

    it('handles empty response body', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      const result = await http.get('/empty');

      expect(result.success).toBe(true);
    });

    it('handles response without data wrapper', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ name: 'direct' }),
      });

      const result = await http.get<{ name: string }>('/direct');

      // Should fall back to json itself when no .data property
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: 'direct' });
    });
  });

  describe('Error handling', () => {
    it('handles network failure (fetch throws)', async () => {
      mockFetch.mockRejectedValue(new Error('Network request failed'));

      const result = await http.get('/failing');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network request failed');
      expect(result.status).toBe(0);
    });

    it('handles JSON parse failure', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const result = await http.get('/bad-json');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Empty response');
    });

    it('handles non-Error thrown object', async () => {
      mockFetch.mockRejectedValue('string error');

      const result = await http.get('/string-error');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unknown error');
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });
    });

    it('sends GET request without body', async () => {
      await http.get('/items');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('GET');
      expect(options.body).toBeUndefined();
    });

    it('sends POST with JSON body', async () => {
      await http.post('/items', { name: 'test' });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(options.body).toBe(JSON.stringify({ name: 'test' }));
    });

    it('sends PUT with JSON body', async () => {
      await http.put('/items/1', { name: 'updated' });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('PUT');
      expect(options.body).toBe(JSON.stringify({ name: 'updated' }));
    });

    it('sends PATCH with JSON body', async () => {
      await http.patch('/items/1', { name: 'patched' });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('PATCH');
    });

    it('sends DELETE request', async () => {
      await http.delete('/items/1');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('DELETE');
    });
  });

  describe('URL construction', () => {
    it('constructs full URL from config base + endpoint', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });

      await http.get('/v1/api/test');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/v1/api/test');
      expect(url).toMatch(/^https?:\/\//);
    });
  });
});
