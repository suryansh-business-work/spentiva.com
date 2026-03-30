/**
 * Edge case tests for services.
 * Tests error handling, empty responses, pagination edge cases.
 */
import { expenseService } from '@/services/expenseService';
import { trackerService } from '@/services/trackerService';
import { analyticsService } from '@/services/analyticsService';
import { http } from '@/utils/http';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;

describe('Service Layer - Edge Cases', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('expenseService', () => {
    it('builds correct URL with pagination params', async () => {
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { expenses: [], total: 0 },
        message: 'OK',
        status: 200,
      });

      await expenseService.getAll('tracker-1', { page: 2, limit: 25, sort: '-createdAt' });

      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
      );
      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=25'),
      );
      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('sort=-createdAt'),
      );
    });

    it('builds URL without params when none provided', async () => {
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { expenses: [], total: 0 },
        message: 'OK',
        status: 200,
      });

      await expenseService.getAll('tracker-1');

      const calledUrl = mockHttp.get.mock.calls[0][0];
      expect(calledUrl).not.toContain('page=');
      expect(calledUrl).not.toContain('limit=');
    });

    it('delete sends correct endpoint', async () => {
      mockHttp.delete.mockResolvedValue({
        success: true,
        data: null,
        message: 'Deleted',
        status: 200,
      });

      await expenseService.delete('exp-123');

      expect(mockHttp.delete).toHaveBeenCalledWith(
        expect.stringContaining('exp-123'),
      );
    });

    it('bulkDelete sends array of IDs', async () => {
      mockHttp.post.mockResolvedValue({
        success: true,
        data: null,
        message: 'Deleted',
        status: 200,
      });

      await expenseService.bulkDelete(['e1', 'e2', 'e3']);

      expect(mockHttp.post).toHaveBeenCalledWith(
        expect.any(String),
        { ids: ['e1', 'e2', 'e3'] },
      );
    });
  });

  describe('trackerService', () => {
    it('create sends correct payload', async () => {
      mockHttp.post.mockResolvedValue({
        success: true,
        data: { _id: 't1', name: 'Test', type: 'personal', currency: 'USD' },
        message: 'Created',
        status: 201,
      });

      await trackerService.create({
        name: 'My Tracker',
        type: 'personal',
        currency: 'USD',
      });

      expect(mockHttp.post).toHaveBeenCalledWith(
        expect.any(String),
        { name: 'My Tracker', type: 'personal', currency: 'USD' },
      );
    });

    it('share sends email and role', async () => {
      mockHttp.post.mockResolvedValue({
        success: true,
        data: null,
        message: 'Shared',
        status: 200,
      });

      await trackerService.share('t1', { email: 'user@example.com', role: 'editor' });

      expect(mockHttp.post).toHaveBeenCalledWith(
        expect.stringContaining('t1'),
        { email: 'user@example.com', role: 'editor' },
      );
    });
  });

  describe('analyticsService', () => {
    it('getSummary includes tracker ID in URL', async () => {
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { totalExpenses: 0, totalIncome: 0, netBalance: 0, transactionCount: 0 },
        message: 'OK',
        status: 200,
      });

      await analyticsService.getSummary('tracker-abc', { period: 'thisMonth' });

      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('tracker-abc'),
      );
    });

    it('getByCategory includes tracker ID in URL', async () => {
      mockHttp.get.mockResolvedValue({
        success: true,
        data: [],
        message: 'OK',
        status: 200,
      });

      await analyticsService.getByCategory('tracker-xyz', { period: 'all' });

      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('tracker-xyz'),
      );
    });
  });
});
