import { http } from '@/utils/http';
import { usageService } from '@/services/usageService';
import config from '@/config';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;
const { USAGE } = config.ENDPOINTS;

describe('usageService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getOverview calls correct endpoint', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
    await usageService.getOverview();
    expect(mockHttp.get).toHaveBeenCalledWith(USAGE.OVERVIEW);
  });

  it('getGraphs calls correct endpoint', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
    await usageService.getGraphs();
    expect(mockHttp.get).toHaveBeenCalledWith(USAGE.GRAPHS);
  });
});
