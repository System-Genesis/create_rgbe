import axios from 'axios';
import { krtflEntity, entity } from '../types/entityType';
import config from '../config/env.config';
import { getResData } from './getResData';
import getToken from '../auth/spike';

export const entityApi = {
  create: async (entity: entity) => {
    return await getResData(
      axios.post(`${config.krtflApi}/entities`, entity, getToken())
    );
  },

  update: async (id: string, entity: entity) => {
    return await getResData(
      axios.patch(`${config.krtflApi}/entities/${id}`, entity, getToken())
    );
  },

  delete: async (id: string) => {
    return await getResData(
      axios.delete(`${config.krtflApi}/entities/${id}`, getToken())
    );
  },

  get: async (id: string): Promise<krtflEntity> => {
    return await getResData(
      axios.get(`${config.krtflApi}/entities/${id}`, getToken())
    );
  },
};
