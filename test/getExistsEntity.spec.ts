import { getExistsEntity } from '../src/service/entity/saveEntity';

jest.mock('../src/logger/logger', () => ({
  logInfo: () => {},
}));

jest.mock('../src/api/entity', () => ({
  entityApi: {
    get: (id: string) => {
      if (id === 'identityCard') return { id: '2', identityCard: '1' };
      if (id === 'personalNumber') return { id: '3', personalNumber: '1' };
      if (id === 'goalUserId') return { id: '4', goalUserId: '1' };

      return null;
    },
  },
}));

describe('getExistsEntity', () => {
  it('Should return goalUser', async () => {
    const actual = await getExistsEntity({ goalUserId: 'goalUserId' });
    const expected = '1';

    expect(actual.goalUserId).toEqual(expected);
  });

  it('Should return personalNumber', async () => {
    const actual = await getExistsEntity({ personalNumber: 'personalNumber' });
    const expected = '1';

    expect(actual.personalNumber).toEqual(expected);
  });

  it('Should return identityCard', async () => {
    const actual = await getExistsEntity({ identityCard: 'identityCard' });
    const expected = '1';

    expect(actual.identityCard).toEqual(expected);
  });

  it('Should return personalNumber when identityCard did not return entity', async () => {
    const actual = await getExistsEntity({ personalNumber: 'personalNumber', identityCard: '2' });
    const expected = '1';

    expect(actual.personalNumber).toEqual(expected);
  });
});
