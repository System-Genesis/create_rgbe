import { insertEntity } from '../src/service/entity/saveEntity';

let create: boolean | undefined;
let update: boolean | undefined;

jest.mock('../src/logger/logger', () => ({
  logInfo: () => {},
}));

jest.mock('../src/api/entity', () => ({
  entityApi: {
    get: (id: string) =>
      id === '1'
        ? null
        : {
            id: '1',
            identityCard: '1',
            goalUserId: '123',
            personalNumber: '156',
          },
    update: () => (update = true),
    create: () => (create = true),
  },
}));

describe('saveEntity', () => {
  describe('insertEntity', () => {
    beforeEach(() => {
      create = undefined;
      update = undefined;
    });

    it('Should update entity', async () => {
      await insertEntity({ identityCard: '15621' });

      expect(update).toBeTruthy();
    });

    it('Should not update entity (no diff)', async () => {
      await insertEntity({ identityCard: '1' });

      expect(update).toBeFalsy();
    });

    it('Should create entity', async () => {
      await insertEntity({ goalUserId: '1' });

      expect(create).toBeTruthy();
    });
  });
});
