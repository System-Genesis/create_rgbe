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

const update = async (identifier: string, entityToUpdate: entity) => {
  if (!(await kartoffelApi.update(identifier, entityToUpdate))) {
    return null;
  }

  return await mirrorApi.update(identifier, entityToUpdate);
};

export const entityApi = {
  create,
  update,
  delete: deleteEntity,
  get,
  getId,
};
