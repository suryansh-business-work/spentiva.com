import { http } from '@/utils/http';
import { trackerService } from '@/services/trackerService';
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
const { TRACKERS } = config.ENDPOINTS;

describe('trackerService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll calls http.get with correct endpoint', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
    await trackerService.getAll();
    expect(mockHttp.get).toHaveBeenCalledWith(TRACKERS.GET_ALL);
  });

  it('create sends POST with tracker data', async () => {
    const data = { name: 'Trip', type: 'personal', currency: 'USD' };
    mockHttp.post.mockResolvedValue({ success: true, data: { ...data, _id: '1' }, message: 'Created', status: 201 });
    await trackerService.create(data);
    expect(mockHttp.post).toHaveBeenCalledWith(TRACKERS.CREATE, data);
  });

  it('update sends PUT with partial data', async () => {
    mockHttp.put.mockResolvedValue({ success: true, data: null, message: 'Updated', status: 200 });
    await trackerService.update('abc', { name: 'Renamed' });
    expect(mockHttp.put).toHaveBeenCalledWith(TRACKERS.UPDATE('abc'), { name: 'Renamed' });
  });

  it('delete sends DELETE with tracker id', async () => {
    mockHttp.delete.mockResolvedValue({ success: true, data: null, message: 'Deleted', status: 200 });
    await trackerService.delete('abc');
    expect(mockHttp.delete).toHaveBeenCalledWith(TRACKERS.DELETE('abc'));
  });

  it('share sends POST with email and role', async () => {
    const shareData = { email: 'user@test.com', role: 'viewer' };
    mockHttp.post.mockResolvedValue({ success: true, data: null, message: 'Shared', status: 200 });
    await trackerService.share('abc', shareData);
    expect(mockHttp.post).toHaveBeenCalledWith(TRACKERS.SHARE('abc'), shareData);
  });

  it('unshare sends POST with userId', async () => {
    mockHttp.post.mockResolvedValue({ success: true, data: null, message: 'Unshared', status: 200 });
    await trackerService.unshare('abc', { userId: 'u1' });
    expect(mockHttp.post).toHaveBeenCalledWith(TRACKERS.UNSHARE('abc'), { userId: 'u1' });
  });
});
