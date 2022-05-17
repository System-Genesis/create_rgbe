import { AxiosReqEnum } from '../../types/axiosReqType';
import { krtflEntity, entity } from '../../types/entityType';
import { axiosWrapKartoffel } from '../utils/axiosWrapKartoffel';

const create = async (entity: entity): Promise<krtflEntity | null> => {
  delete entity.employeeId;
  return await axiosWrapKartoffel(AxiosReqEnum.post, `/entities`, entity);
};

const get = async (identifier: string): Promise<krtflEntity | null> => {
  return await axiosWrapKartoffel(AxiosReqEnum.get, `/entities/identifier/${identifier}`);
};

const deleteEntity = async (identifier: string) => {
  const entityKrtfl = await get(identifier);
  if (!entityKrtfl) return null;
  return await axiosWrapKartoffel(AxiosReqEnum.delete, `/entities/${entityKrtfl.id}`);
};

const update = async (identifier: string, entityToUpdate: entity) => {
  const entityKrtfl = await get(identifier);
  if (!entityKrtfl) return null;
  return await axiosWrapKartoffel(AxiosReqEnum.patch, `/entities/${entityKrtfl.id}`, entityToUpdate);
};

export const kartoffelApi = {
  create,
  update,
  delete: deleteEntity,
  get,
};
