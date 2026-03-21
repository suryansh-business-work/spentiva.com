import { http } from '@/utils/http';
import { categoryService } from '@/services/categoryService';
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
const { CATEGORIES } = config.ENDPOINTS;

describe('categoryService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll calls with trackerId query param', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
    await categoryService.getAll('t1');
    expect(mockHttp.get).toHaveBeenCalledWith(CATEGORIES.GET_ALL('t1'));
    expect(mockHttp.get.mock.calls[0][0]).toContain('trackerId=t1');
  });

  it('create sends POST with category data', async () => {
    const data = { name: 'Food', trackerId: 't1', icon: 'food', color: '#FF0000' };
    mockHttp.post.mockResolvedValue({ success: true, data: { ...data, _id: 'c1' }, message: 'Created', status: 201 });
    await categoryService.create(data);
    expect(mockHttp.post).toHaveBeenCalledWith(CATEGORIES.CREATE, data);
  });

  it('update sends PUT', async () => {
    mockHttp.put.mockResolvedValue({ success: true, data: null, message: 'Updated', status: 200 });
    await categoryService.update('c1', { name: 'Meals' });
    expect(mockHttp.put).toHaveBeenCalledWith(CATEGORIES.UPDATE('c1'), { name: 'Meals' });
  });

  it('delete sends DELETE', async () => {
    mockHttp.delete.mockResolvedValue({ success: true, data: null, message: 'Deleted', status: 200 });
    await categoryService.delete('c1');
    expect(mockHttp.delete).toHaveBeenCalledWith(CATEGORIES.DELETE('c1'));
  });
});
