import { createRgb } from '../src/service/rgb/rgbHandler';

// {
//     og: { id: '2', hierarchy: 'string', ancestors: ['string'], name: 'string' },
//     di: { uniqueId: 'string', entityId: 'string' },
//     role: { roleId: 'string', directGroup: 'string', digitalIdentityUniqueId: 'string' },
//   }

let saveOG = '';
let saveRole = '';
let saveDI = '';

jest.mock('../src/service/rgb/saveDI', () => ({
  insertDI: () => (saveDI = 'saveDI'),
}));

jest.mock('../src/service/rgb/saveOG', () => ({
  insertOG: () => (saveOG = 'saveOG'),
}));

jest.mock('../src/service/rgb/saveRole', () => ({
  insertRole: () => (saveRole = 'saveRole'),
}));

describe('rgbHandler', () => {
  it('Should create only DI', async () => {
    await createRgb({
      og: null,
      di: { uniqueId: 'string', entityId: 'string' },
      role: null,
    });

    expect(saveDI).toEqual('saveDI');
    expect(saveOG).toEqual('');
    expect(saveRole).toEqual('');
  });

  it('Should create only DI (has OG)', async () => {
    await createRgb({
      og: { id: '2', hierarchy: 'string', ancestors: ['string'], name: 'string', source: 'aka' },
      di: { uniqueId: 'string', entityId: 'string' },
      role: null,
    });

    expect(saveDI).toEqual('saveDI');
    expect(saveOG).toEqual('');
    expect(saveRole).toEqual('');
  });

  it('Should create only DI (has Role)', async () => {
    await createRgb({
      og: null,
      di: { uniqueId: 'string', entityId: 'string' },
      role: { roleId: 'string', directGroup: 'string', digitalIdentityUniqueId: 'string' },
    });

    expect(saveDI).toEqual('saveDI');
    expect(saveOG).toEqual('');
    expect(saveRole).toEqual('');
  });

  it('Should create all', async () => {
    await createRgb({
      og: { id: '2', hierarchy: 'string', ancestors: ['string'], name: 'string', source: 'aka' },
      di: { uniqueId: 'string', entityId: 'string' },
      role: { roleId: 'string', directGroup: 'string', digitalIdentityUniqueId: 'string' },
    });

    expect(saveDI).toEqual('saveDI');
    expect(saveOG).toEqual('saveOG');
    expect(saveRole).toEqual('saveRole');
  });
});
