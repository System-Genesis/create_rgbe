import { diff } from './../src/util/utils';

describe('utils', () => {
  describe('diff', () => {
    it('Should return empty obj because the obj are similar', () => {
      const toCompare = { name: 'a', age: 1, active: true };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = {};

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });

    it('Should return empty obj because there is no changes in toCompare obj', () => {
      const toCompare = { name: 'a', age: 1 };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = {};

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });

    it('Should return obj with name field that change to "b"', () => {
      const toCompare = { name: 'b', age: 1 };
      const compareTo = { name: 'a', age: 1, active: true };
      const expected = { name: 'b' };

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });
  });

  describe('diff with nested Obj', () => {
    it('Should return empty obj because the obj are similar', () => {
      const toCompare = { name: 'a', age: 1, active: { a: true } };
      const compareTo = { name: 'a', age: 1, active: { a: true } };
      const expected = {};

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });

    it('Should return empty obj because there is no changes in toCompare obj', () => {
      const toCompare = { name: 'a', age: 1 };
      const compareTo = { name: 'a', age: 1, active: { a: true } };
      const expected = {};

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });

    it('Should return obj with name field that change to "b"', () => {
      const toCompare = { name: 'a', age: 1, active: { a: true } };
      const compareTo = { name: 'a', age: 1, active: { a: false } };
      const expected = { active: { a: true } };

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });

    it('Should check nested obj', () => {
      const toCompare: any = { a: { name: 'a', b: { age: 1 } }, active: { a: true } };
      const compareTo: any = { name: 'a', age: 1, active: { a: false } };
      const expected = { a: { name: 'a', b: { age: 1 } }, active: { a: true } };

      expect(diff(toCompare, compareTo)).toEqual(expected);
    });
    
    it('Should check nested obj', () => {
      const toCompare: any = { a: { name: 'a', b: { age: 1 } }, active: { a: true } };
      const compareTo: any = { a:{name: 'a', age: 1, },active: { a: false } };
      const expected = { a: { name: 'a', b: { age: 1 } }, active: { a: true } };
      const actual = diff(toCompare, compareTo);

      expect(actual).toEqual(expected);
    });
  });
});
