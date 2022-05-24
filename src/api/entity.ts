import { kartoffelApi } from './entity/kartoffel';
import { entity, krtflEntity } from '../types/entityType';
import { mirrorApi } from './entity/mirror';

const create = async (entity: entity): Promise<krtflEntity | null> => {
  const krtflEnt = await kartoffelApi.create(entity);
  if (!krtflEnt || !(await mirrorApi.create(entity))) {
    return null;
  }

  return krtflEnt;
};

const deleteEntity = async (identifier: string) => {
  if (!(await kartoffelApi.delete(identifier))) {
    return null;
  }

  return await mirrorApi.delete(identifier);
};

const get = async (identifier: string): Promise<entity | null> => {
  return await mirrorApi.get(identifier);
};

const getId = async (identifier: string): Promise<string | null> => {
  const entityKrtfl = await kartoffelApi.get(identifier);

  return entityKrtfl ? entityKrtfl.id : null;
};
const getKartoffelEntity = async (identifier: string): Promise<entity | null> => {
  return await kartoffelApi.get(identifier);
};

const update = async (identifier: string, entityToUpdate: entity) => {
  if (!(await kartoffelApi.update(identifier, entityToUpdate))) {
    return null;
  }

  return await mirrorApi.update(identifier, entityToUpdate);
};

/**
 * check if exist in mirror
 * exist: return mirror obj
 * not exist: check if exist in kartoffel
 *      exist: save entity from queue to mirror and return him
 *      not exist: return null
 *
 * @param entity from queue
 * @returns kartofel entity / null
 */
async function getExistsEntity(entity: entity) {
  const mirrorEnt = await getEntityFromFunc(entity, get);

  if (mirrorEnt) return mirrorEnt;

  const krtflEnt = await getEntityFromFunc(entity, getKartoffelEntity);

  if (krtflEnt) await mirrorApi.create(entity);

  return krtflEnt;
}

/**
 * Search entity in kartofel/mirror by goalUserId or identityCard and/or personalNumber
 * If has identityCard but not found steel need to check by personalNumber
 * If there in so identityCard field than personalNumber must to exist
 * @param entity from queue
 * @returns kartofel entity / null
 */
async function getEntityFromFunc(entity: entity, searchFunc: Function) {
  if (entity.goalUserId) return await searchFunc(entity.goalUserId);
  if (entity.employeeId) return await searchFunc(entity.employeeId);

  return (
    (await searchFunc(entity.identityCard || entity.personalNumber!)) ||
    (await searchFunc(entity.personalNumber!))
  );
}

export const entityApi = {
  create,
  update,
  delete: deleteEntity,
  get,
  getId,
  getExistsEntity,
};
