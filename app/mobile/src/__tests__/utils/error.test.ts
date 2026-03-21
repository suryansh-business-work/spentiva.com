import { getErrorMessage } from '@/utils/error';

describe('getErrorMessage', () => {
  it('returns string errors directly', () => {
    expect(getErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('extracts message from Error objects', () => {
    expect(getErrorMessage(new Error('Test error'))).toBe('Test error');
  });

  it('extracts message from objects with message property', () => {
    expect(getErrorMessage({ message: 'Object error' })).toBe('Object error');
  });

  it('returns default message for unknown types', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    expect(getErrorMessage(42)).toBe('An unexpected error occurred');
  });
});
