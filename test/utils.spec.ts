import { diff, diffPic } from './../src/util/utils';

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
      const compareTo: any = { a: { name: 'a', age: 1 }, active: { a: false } };
      const expected = { a: { name: 'a', b: { age: 1 } }, active: { a: true } };
      const actual = diff(toCompare, compareTo);

      expect(actual).toEqual(expected);
    });
  });

  describe('diffPic', () => {
    it('Should diffPic only profile', () => {
      const toCompare: any = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
          avatar: { meta: { updateAt: '23' } },
        },
        a: { name: 'a', b: { age: 1 } },
        active: { a: true },
      };
      const compareTo: any = {
        pictures: {
          profile: { meta: { updateAt: '1234' } },
          avatar: { meta: { updateAt: '23' } },
        },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      const expected = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
        },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      diffPic(toCompare, compareTo);

      expect(compareTo).toEqual(expected);
    });

    it('Should diffPic only avatar', () => {
      const toCompare: any = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
          avatar: { meta: { updateAt: '2s3' } },
        },
        a: { name: 'a', b: { age: 1 } },
        active: { a: true },
      };
      const compareTo: any = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
          avatar: { meta: { updateAt: '23' } },
        },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      const expected = {
        pictures: { avatar: { meta: { updateAt: '2s3' } } },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      diffPic(toCompare, compareTo);

      expect(compareTo).toEqual(expected);
    });

    it('Should diffPic profile & avatar', () => {
      const toCompare: any = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
          avatar: { meta: { updateAt: '2s3' } },
        },
        a: { name: 'a', b: { age: 1 } },
        active: { a: true },
      };
      const compareTo: any = {
        pictures: {
          profile: { meta: { updateAt: '1234' } },
          avatar: { meta: { updateAt: '23' } },
        },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      const expected = {
        pictures: {
          profile: { meta: { updateAt: '123' } },
          avatar: { meta: { updateAt: '2s3' } },
        },
        a: { name: 'a', age: 1 },
        active: { a: false },
      };
      diffPic(toCompare, compareTo);

      expect(compareTo).toEqual(expected);
    });
  });
});
