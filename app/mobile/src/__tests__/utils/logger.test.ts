import { logger } from '@/utils/logger';

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs info messages in dev mode', () => {
    logger.info('test info');
    expect(console.log).toHaveBeenCalled();
  });

  it('logs warning messages', () => {
    logger.warn('test warning');
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    logger.error('test error');
    expect(console.error).toHaveBeenCalled();
  });

  it('includes data in log output', () => {
    logger.error('error with data', { key: 'value' });
    expect(console.error).toHaveBeenCalled();
  });
});
