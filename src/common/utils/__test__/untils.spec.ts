import { createToken, md5Decode } from '..';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => {
  const sign = () => '';
  return { sign };
});

describe('utils', () => {
  it('createToken', () => {
    expect(createToken({ username: '' })).toBe('');
  });

  it('md5Decode', () => {
    expect(md5Decode('123456')).toMatchSnapshot();
  });
});
