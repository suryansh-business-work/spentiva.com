import { http } from '@/utils/http';
import { expenseService } from '@/services/expenseService';
import config from '@/config';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;
const { EXPENSES } = config.ENDPOINTS;

describe('expenseService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAll', () => {
    it('calls with trackerId only', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await expenseService.getAll('t1');
      expect(mockHttp.get).toHaveBeenCalledWith(EXPENSES.ALL('t1'));
    });

    it('appends pagination params', async () => {
      mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
      await expenseService.getAll('t1', { page: 2, limit: 10, sort: '-date' });
      const url = mockHttp.get.mock.calls[0][0];
      expect(url).toContain('trackerId=t1');
      expect(url).toContain('page=2');
      expect(url).toContain('limit=10');
      expect(url).toContain('sort=-date');
    });
  });

  it('getById calls with expense id', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: { _id: 'e1' }, message: 'OK', status: 200 });
    await expenseService.getById('e1');
    expect(mockHttp.get).toHaveBeenCalledWith(EXPENSES.BY_ID('e1'));
  });

  it('create sends POST with expense data', async () => {
    const data = {
      trackerId: 't1',
      type: 'expense',
      amount: 50,
      category: 'Food',
      description: 'Lunch',
      paymentMethod: 'cash',
      currency: 'USD',
    };
    mockHttp.post.mockResolvedValue({ success: true, data: { ...data, _id: 'e1' }, message: 'Created', status: 201 });
    await expenseService.create(data);
    expect(mockHttp.post).toHaveBeenCalledWith(EXPENSES.CREATE, data);
  });

  it('update sends PUT', async () => {
    mockHttp.put.mockResolvedValue({ success: true, data: null, message: 'Updated', status: 200 });
    await expenseService.update('e1', { amount: 75 });
    expect(mockHttp.put).toHaveBeenCalledWith(EXPENSES.UPDATE('e1'), { amount: 75 });
  });

  it('delete sends DELETE', async () => {
    mockHttp.delete.mockResolvedValue({ success: true, data: null, message: 'Deleted', status: 200 });
    await expenseService.delete('e1');
    expect(mockHttp.delete).toHaveBeenCalledWith(EXPENSES.DELETE('e1'));
  });

  it('bulkDelete sends POST with ids', async () => {
    mockHttp.post.mockResolvedValue({ success: true, data: null, message: 'Deleted', status: 200 });
    await expenseService.bulkDelete(['e1', 'e2']);
    expect(mockHttp.post).toHaveBeenCalledWith(EXPENSES.BULK_DELETE, { ids: ['e1', 'e2'] });
  });

  it('parse sends POST with message and trackerId', async () => {
    const data = { message: 'spent 50 on food', trackerId: 't1' };
    mockHttp.post.mockResolvedValue({ success: true, data: { expenses: [] }, message: 'Parsed', status: 200 });
    await expenseService.parse(data);
    expect(mockHttp.post).toHaveBeenCalledWith(EXPENSES.PARSE, data);
  });
});
