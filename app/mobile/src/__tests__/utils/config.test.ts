import config from '@/config';

describe('config', () => {
  it('has a valid API_URL', () => {
    expect(config.API_URL).toBeDefined();
    expect(typeof config.API_URL).toBe('string');
    expect(config.API_URL.startsWith('http')).toBe(true);
  });

  it('has IMAGEKIT_URL_ENDPOINT', () => {
    expect(config.IMAGEKIT_URL_ENDPOINT).toBeDefined();
    expect(config.IMAGEKIT_URL_ENDPOINT).toContain('imagekit.io');
  });

  describe('AUTH endpoints', () => {
    it('has all auth endpoints', () => {
      expect(config.AUTH.ME).toBe('/v1/api/auth/me');
      expect(config.AUTH.LOGIN).toBe('/v1/api/auth/login');
      expect(config.AUTH.REGISTER).toBe('/v1/api/auth/register');
      expect(config.AUTH.FORGOT_PASSWORD).toBe('/v1/api/auth/forgot-password');
      expect(config.AUTH.RESET_PASSWORD).toBe('/v1/api/auth/reset-password');
      expect(config.AUTH.PROFILE).toBe('/v1/api/auth/profile');
    });
  });

  describe('TRACKERS endpoints', () => {
    const { TRACKERS } = config.ENDPOINTS;

    it('has correct static endpoints', () => {
      expect(TRACKERS.GET_ALL).toBe('/v1/api/tracker/all');
      expect(TRACKERS.CREATE).toBe('/v1/api/tracker/create');
    });

    it('generates correct dynamic endpoints', () => {
      expect(TRACKERS.GET_BY_ID('abc123')).toBe('/v1/api/tracker/get/abc123');
      expect(TRACKERS.UPDATE('abc123')).toBe('/v1/api/tracker/update/abc123');
      expect(TRACKERS.DELETE('abc123')).toBe('/v1/api/tracker/delete/abc123');
      expect(TRACKERS.SHARE('abc123')).toBe('/v1/api/tracker/share/abc123');
      expect(TRACKERS.UNSHARE('abc123')).toBe('/v1/api/tracker/unshare/abc123');
    });
  });

  describe('CATEGORIES endpoints', () => {
    const { CATEGORIES } = config.ENDPOINTS;

    it('includes trackerId as query param', () => {
      expect(CATEGORIES.GET_ALL('t1')).toBe('/v1/api/category/all?trackerId=t1');
    });

    it('has correct static and dynamic endpoints', () => {
      expect(CATEGORIES.CREATE).toBe('/v1/api/category/create');
      expect(CATEGORIES.UPDATE('c1')).toBe('/v1/api/category/c1');
      expect(CATEGORIES.DELETE('c1')).toBe('/v1/api/category/c1');
    });
  });

  describe('EXPENSES endpoints', () => {
    const { EXPENSES } = config.ENDPOINTS;

    it('includes trackerId as query param for ALL', () => {
      expect(EXPENSES.ALL('t1')).toBe('/v1/api/expense/all?trackerId=t1');
    });

    it('BY_ID only takes expense id', () => {
      expect(EXPENSES.BY_ID('e1')).toBe('/v1/api/expense/e1');
    });

    it('has correct static endpoints', () => {
      expect(EXPENSES.PARSE).toBe('/v1/api/expense/parse');
      expect(EXPENSES.CREATE).toBe('/v1/api/expense/create');
      expect(EXPENSES.BULK_DELETE).toBe('/v1/api/expense/bulk-delete');
    });
  });

  describe('ANALYTICS endpoints', () => {
    const { ANALYTICS } = config.ENDPOINTS;

    it('uses query params for trackerId', () => {
      expect(ANALYTICS.SUMMARY('t1')).toContain('?trackerId=t1');
      expect(ANALYTICS.BY_CATEGORY('t1')).toContain('?trackerId=t1');
      expect(ANALYTICS.BY_MONTH('t1')).toContain('?trackerId=t1');
      expect(ANALYTICS.BY_PAYMENT_METHOD('t1')).toContain('?trackerId=t1');
      expect(ANALYTICS.TOTAL('t1')).toContain('?trackerId=t1');
      expect(ANALYTICS.EMAIL_REPORT('t1')).toContain('?trackerId=t1');
    });

    it('uses correct server route names', () => {
      expect(ANALYTICS.BY_PAYMENT_METHOD('t1')).toContain('/by-expense-from');
    });
  });

  describe('USAGE endpoints', () => {
    it('has correct paths', () => {
      expect(config.ENDPOINTS.USAGE.OVERVIEW).toBe('/v1/api/usage/overview');
      expect(config.ENDPOINTS.USAGE.GRAPHS).toBe('/v1/api/usage/graphs');
    });
  });

  describe('SUPPORT endpoints', () => {
    const { SUPPORT } = config.ENDPOINTS;

    it('includes /tickets in paths', () => {
      expect(SUPPORT.CREATE).toContain('/tickets');
      expect(SUPPORT.GET_ALL).toContain('/tickets');
      expect(SUPPORT.GET_BY_ID('s1')).toContain('/tickets/s1');
      expect(SUPPORT.UPDATE_STATUS('s1')).toContain('/tickets/s1/status');
    });
  });

  describe('PAYMENT endpoints', () => {
    it('has stats endpoint', () => {
      expect(config.ENDPOINTS.PAYMENT.STATS).toBe('/v1/api/payment/stats');
    });
  });

  describe('PLANS', () => {
    it('has free plan with correct limits', () => {
      expect(config.PLANS.FREE.trackers).toBe(3);
      expect(config.PLANS.FREE.price).toBe(0);
    });

    it('has pro plan pricing', () => {
      expect(config.PLANS.PRO.monthlyPrice).toBe(9);
      expect(config.PLANS.PRO.yearlyPrice).toBe(86.4);
    });

    it('has business pro plan with unlimited', () => {
      expect(config.PLANS.BUSINESS_PRO.trackers).toBe(Infinity);
    });
  });
});
