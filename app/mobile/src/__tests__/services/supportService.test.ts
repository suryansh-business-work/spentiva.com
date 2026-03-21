import { http } from '@/utils/http';
import { supportService } from '@/services/supportService';
import config from '@/config';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;
const { SUPPORT } = config.ENDPOINTS;

describe('supportService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll calls correct endpoint', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
    await supportService.getAll();
    expect(mockHttp.get).toHaveBeenCalledWith(SUPPORT.GET_ALL);
  });

  it('getById calls with ticket id', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
    await supportService.getById('s1');
    expect(mockHttp.get).toHaveBeenCalledWith(SUPPORT.GET_BY_ID('s1'));
  });

  it('create sends POST with ticket data', async () => {
    const data = { type: 'bug', subject: 'Test', description: 'Bug report' };
    mockHttp.post.mockResolvedValue({ success: true, data: { ...data, _id: 's1' }, message: 'Created', status: 201 });
    await supportService.create(data);
    expect(mockHttp.post).toHaveBeenCalledWith(SUPPORT.CREATE, data);
  });
});
