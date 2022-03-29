import axios from 'axios';
import { krtflEntity, entity } from '../../types/entityType';
import { getResData } from '../utils/getResData';

const create = async (entity: entity): Promise<krtflEntity | null> => {
  return await getResData(axios.post(`/entities`, entity));
};

const get = async (identifier: string): Promise<krtflEntity | null> => {
  return await getResData(axios.get(`/entities/identifier/${identifier}`));
};

const deleteEntity = async (identifier: string) => {
  const entityKrtfl = await get(identifier);
  if (!entityKrtfl) return null;
  return await getResData(axios.delete(`/entities/${entityKrtfl.id}`));
};

const update = async (identifier: string, entity: entity) => {
  const entityKrtfl = await get(identifier);
  if (!entityKrtfl) return null;
  return await getResData(axios.patch(`/entities/${entityKrtfl.id}`, entity));
};

export const kartoffelApi = {
  create,
  update,
  delete: deleteEntity,
  get,
};
