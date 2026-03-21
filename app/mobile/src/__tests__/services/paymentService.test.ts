import { http } from '@/utils/http';
import { paymentService } from '@/services/paymentService';
import config from '@/config';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockHttp = http as jest.Mocked<typeof http>;
const { PAYMENT } = config.ENDPOINTS;

describe('paymentService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('create sends POST with payment data', async () => {
    const data = { plan: 'pro', planDuration: 'monthly', paymentMethod: 'card' };
    mockHttp.post.mockResolvedValue({ success: true, data: { ...data, _id: 'p1' }, message: 'Created', status: 201 });
    await paymentService.create(data);
    expect(mockHttp.post).toHaveBeenCalledWith(PAYMENT.CREATE, data);
  });

  it('getById calls with payment id', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: {}, message: 'OK', status: 200 });
    await paymentService.getById('p1');
    expect(mockHttp.get).toHaveBeenCalledWith(PAYMENT.GET_BY_ID('p1'));
  });

  it('getUserPayments calls with userId', async () => {
    mockHttp.get.mockResolvedValue({ success: true, data: [], message: 'OK', status: 200 });
    await paymentService.getUserPayments('u1');
    expect(mockHttp.get).toHaveBeenCalledWith(PAYMENT.GET_USER_PAYMENTS('u1'));
  });
});
