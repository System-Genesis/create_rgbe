import chai, { assert } from 'chai';
import { diff } from './../src/util/utils';

chai.should();

describe('utils', () => {
  describe('diff', () => {
    it('Should return empty obj because the obj are similar', () => {
      const toCompare = { name: 'a', age: 1, active: true };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = {};

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });

    it('Should return empty obj because there is no changes in toCompare obj', () => {
      const toCompare = { name: 'a', age: 1 };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = {};

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });

    it('Should return obj with name field that change to "b"', () => {
      const toCompare = { name: 'b', age: 1 };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = { name: 'b' };

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });
  });

  describe('diff with nested Obj', () => {
    it('Should return empty obj because the obj are similar', () => {
      const toCompare = { name: 'a', age: 1, active: { a: true } };
      const compareTo = { name: 'a', age: 1, active: { a: true } };
      const expected = {};

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });

    it('Should return empty obj because there is no changes in toCompare obj', () => {
      const toCompare = { name: 'a', age: 1 };
      const compareTo = { name: 'a', age: 1, active: { a: true } };
      const expected = {};

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });

    it('Should return obj with name field that change to "b"', () => {
      const toCompare = { name: 'a', age: 1, active: { a: true } };
      const compareTo = { name: 'a', age: 1, active: { a: false } };
      const expected = { active: { a: true } };

      assert.deepEqual(diff(toCompare, compareTo), expected);
    });
  });
});
