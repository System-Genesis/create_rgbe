import config from '../../config/env.config';
import { AxiosReqEnum } from '../../types/axiosReqType';
import { entity } from '../../types/entityType';
import { axiosWrapMirror } from '../utils/axiosWrapMirror';

const create = async (entity: entity) => {
  return await axiosWrapMirror(AxiosReqEnum.post, `/${config.mirrorUnique}`, entity);
};

const deleteEntity = async (identifier: string) => {
  return await axiosWrapMirror(AxiosReqEnum.delete, `/${config.mirrorUnique}/${identifier}`);
};

const get = async (identifier: string): Promise<entity> => {
  return await axiosWrapMirror(AxiosReqEnum.get, `/${config.mirrorUnique}/${identifier}`);
};

const update = async (identifier: string, entity: entity) => {
  return await axiosWrapMirror(AxiosReqEnum.patch, `/${config.mirrorUnique}/${identifier}`, entity);
};

export const mirrorApi = {
  create,
  update,
  delete: deleteEntity,
  get,
};
