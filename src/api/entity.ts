import axios from 'axios';
import { krtflEntity, entity } from '../types/entityType';
import config from '../config/env.config';
import { getResData } from './getResData';

export const entityApi = {
  create: async (entity: entity) => {
    return await getResData(axios.post(`${config.krtflApi}/entities`, entity));
  },
  update: async (id: string, entity: entity) => {
    return await getResData(axios.patch(`${config.krtflApi}/entities/${id}`, entity));
  },
  delete: async (id: string) => {
    return await getResData(axios.delete(`${config.krtflApi}/entities/${id}`));
  },
  get: async (id: string): Promise<krtflEntity> => {
    return await getResData(axios.get(`${config.krtflApi}/entities/${id}`));
  },
};
