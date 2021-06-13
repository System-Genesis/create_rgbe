import axios from 'axios';
import { krtflEntity, entity } from '../types/entityType';
import config from '../config/env.config';
import { getResData } from './getResData';

export const entityApi = {
  create: async (entity: entity) => {
    return getResData(await axios.post(`${config.krtflApi}/entities`, entity));
  },
  update: async (id: string, entity: entity) => {
    return getResData(await axios.patch(`${config.krtflApi}/entities/${id}`, entity));
  },
  delete: async (id: string) => {
    return getResData(await axios.delete(`${config.krtflApi}/entities/${id}`));
  },
  get: async (id: string): Promise<krtflEntity> => {
    return getResData(await axios.get(`${config.krtflApi}/entities/${id}`));
  },
};
