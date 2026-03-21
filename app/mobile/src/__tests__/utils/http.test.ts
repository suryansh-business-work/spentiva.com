import { http } from '@/utils/http';
import config from '@/config';
import { getAuthToken } from '@/utils/storage';

jest.mock('@/utils/storage', () => ({
  getAuthToken: jest.fn(),
}));

const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

describe('http utility', () => {
  const mockResponse = (data: unknown, ok = true, status = 200) => ({
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthToken.mockResolvedValue('test-token');
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('sends GET request with auth header', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: { id: '1' }, message: 'OK' }),
      );

      const result = await http.get('/test');
      expect(global.fetch).toHaveBeenCalledWith(
        `${config.API_URL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1' });
    });

    it('does not include body for GET', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: [], message: 'OK' }),
      );

      await http.get('/items');
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
    });
  });

  describe('POST requests', () => {
    it('sends POST request with body', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: { id: '2' }, message: 'Created' }, true, 201),
      );

      const body = { name: 'Test' };
      const result = await http.post('/create', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${config.API_URL}/create`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      );
      expect(result.success).toBe(true);
    });
  });

  describe('PUT requests', () => {
    it('sends PUT request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: { updated: true }, message: 'Updated' }),
      );

      await http.put('/update/1', { name: 'Updated' });
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.method).toBe('PUT');
      expect(callArgs.body).toBe(JSON.stringify({ name: 'Updated' }));
    });
  });

  describe('PATCH requests', () => {
    it('sends PATCH request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: {}, message: 'Patched' }),
      );

      await http.patch('/patch/1', { field: 'value' });
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.method).toBe('PATCH');
    });
  });

  describe('DELETE requests', () => {
    it('sends DELETE request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, message: 'Deleted' }),
      );

      const result = await http.delete('/delete/1');
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.method).toBe('DELETE');
      expect(result.success).toBe(true);
    });
  });

  describe('error handling', () => {
    it('returns error for non-ok responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ message: 'Not found' }, false, 404),
      );

      const result = await http.get('/missing');
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Not found');
      expect(result.data).toBeNull();
    });

    it('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await http.get('/failing');
      expect(result.success).toBe(false);
      expect(result.status).toBe(0);
      expect(result.message).toBe('Network error');
    });

    it('handles unknown errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('unexpected');

      const result = await http.get('/crash');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unknown error');
    });
  });

  describe('auth handling', () => {
    it('skips auth header when no token', async () => {
      mockGetAuthToken.mockResolvedValue(null);
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: null, message: 'OK' }),
      );

      await http.get('/public');
      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });

    it('passes custom headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: null, message: 'OK' }),
      );

      await http.get('/custom', { 'X-Custom': 'value' });
      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(headers['X-Custom']).toBe('value');
    });
  });

  describe('response parsing', () => {
    it('uses json.data when available', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: { items: [] }, message: 'OK' }),
      );

      const result = await http.get('/items');
      expect(result.data).toEqual({ items: [] });
    });

    it('falls back to full json when no data key', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ items: [], message: 'OK' }),
      );

      const result = await http.get('/items');
      expect(result.data).toEqual({ items: [], message: 'OK' });
    });

    it('uses default message on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
        mockResponse({ data: null }),
      );

      const result = await http.get('/test');
      expect(result.message).toBe('Success');
    });
  });
});
