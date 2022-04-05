import axios from 'axios';
import config from '../../config/env.config';
import { entity } from '../../types/entityType';
import { getResData } from '../utils/axios/axiosWrap';

const create = async (entity: entity) => {
  return await getResData(axios.post(`/${config.mirrorUnique}`, entity));
};

const deleteEntity = async (identifier: string) => {
  return await getResData(axios.delete(`/${config.mirrorUnique}/${identifier}`));
};

const get = async (identifier: string): Promise<entity> => {
  return await getResData(axios.get(`/${config.mirrorUnique}/${identifier}`));
};

const update = async (identifier: string, entity: entity) => {
  return await getResData(axios.patch(`/${config.mirrorUnique}/${identifier}`, entity));
};

export const mirrorApi = {
  create,
  update,
  delete: deleteEntity,
  get,
};
