import whereami from '../lib/index'
import assert from 'assert'

describe('WHEREAMI', () => {
  it('isStaging check', () => {
     const res = whereami.isStaging
     assert.strictEqual(res, false, 'isStaging is not false')
  });
  it('isDev check', () => {
     const res = whereami.isDev
     assert.strictEqual(res, false, 'isDev is false')
  });
  it('isLocal check', () => {
     const res = whereami.isLocal
     assert.strictEqual(res, true, 'isLocal is true')
  });
  it('isProduction check', () => {
     const res = whereami.isProduction
     assert.strictEqual(res, false, 'isProduction is not false')
  });
});
