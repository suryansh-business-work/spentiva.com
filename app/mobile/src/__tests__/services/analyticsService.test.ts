import { http } from '@/utils/http';
import { analyticsService } from '@/services/analyticsService';
import config from '@/config';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;
const { ANALYTICS } = config.ENDPOINTS;

describe('analyticsService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getSummary', () => {
    it('calls with trackerId', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
      await analyticsService.getSummary('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(ANALYTICS.SUMMARY('t1'));
    });

    it('appends period param', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
      await analyticsService.getSummary('t1', { period: 'monthly' });
      const url = mockHttp.get.mock.calls[0][0];
      expect(url).toContain('trackerId=t1');
      expect(url).toContain('period=monthly');
    });
  });

  describe('getByCategory', () => {
    it('calls correct endpoint', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await analyticsService.getByCategory('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(ANALYTICS.BY_CATEGORY('t1'));
    });

    it('appends period', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await analyticsService.getByCategory('t1', { period: 'yearly' });
      expect(mockHttp.get.mock.calls[0][0]).toContain('period=yearly');
    });
  });

  describe('getByMonth', () => {
    it('calls correct endpoint', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await analyticsService.getByMonth('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(ANALYTICS.BY_MONTH('t1'));
    });
  });

  describe('getByPaymentMethod', () => {
    it('calls by-expense-from endpoint', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await analyticsService.getByPaymentMethod('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(ANALYTICS.BY_PAYMENT_METHOD('t1'));
      expect(mockHttp.get.mock.calls[0][0]).toContain('by-expense-from');
    });
  });

  describe('getTotal', () => {
    it('calls total endpoint', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: { total: 500 }, message: 'OK', status: 200 });
      await analyticsService.getTotal('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(ANALYTICS.TOTAL('t1'));
    });
  });

  describe('emailReport', () => {
    it('sends POST to email-report endpoint', async () => {
      mockHttp.post.mockResolvedValue({ success: true, data: null, message: 'Sent', status: 200 });
      await analyticsService.emailReport('t1');
      expect(mockHttp.post).toHaveBeenCalledWith(ANALYTICS.EMAIL_REPORT('t1'));
    });
  });
});
