import { insertDI } from '../src/service/rgb/saveDI';
import { di } from '../src/types/rgbType';

let update: boolean | undefined;
let create: boolean | undefined;
let connect: boolean | undefined;

jest.mock('../src/api/rgb', () => ({
  diApi: {
    get: (id: string) =>
      id !== '1'
        ? null
        : {
            id: '144',
            uniqueId: '1',
            entityId: '1',
          },
    update: () => (update = true),
    create: () => (create = true),
    connectToEntity: () => {
      connect = true;
    },
  },
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

jest.mock('../src/logger/logger', () => ({
  logInfo: () => {},
  logWarn: () => {},
  logError: () => {},
}));

describe('insertDI', () => {
  beforeEach(() => {
    update = undefined;
    create = undefined;
    connect = undefined;
  });

  it('Should create DI', async () => {
    await insertDI({ uniqueId: '526' });

    expect(create).toBeTruthy();
  });
  it('Should update DI', async () => {
    await insertDI({ uniqueId: '1', personalNumber: '2' } as di);

    expect(update).toBeTruthy();
  });

  it('Should not update DI (no diff)', async () => {
    await insertDI({ uniqueId: '1' });

    expect(update).toBeFalsy();
  });

  it('Should send to connected entity to di', async () => {
    await insertDI({ uniqueId: '1', entityId: '1' });

    expect(connect).toBeTruthy();
  });

  it('Should not send to connected entity to di', async () => {
    await insertDI({ uniqueId: '1', entityId: '123' });

    expect(connect).toBeFalsy();
  });
});
