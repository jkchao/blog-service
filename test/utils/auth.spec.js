
const authIsVerified = require('../../utils/auth');

describe('auth', () => {
  test('is a Vue instance', () => {
    expect(authIsVerified({
      headers: {}
    })).toBeFalsy()
  })
})
