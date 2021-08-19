import axios from 'axios';
import { krtflEntity, entity } from '../types/entityType';
import { getResData } from './getResData';

export const entityApi = {
  create: async (entity: entity) => {
    return await getResData(axios.post(`/entities`, entity));
  },

  update: async (id: string, entity: entity) => {
    return await getResData(axios.patch(`/entities/${id}`, entity));
  },

  delete: async (id: string) => {
    return await getResData(axios.delete(`/entities/${id}`));
  },

  get: async (identifier: string): Promise<krtflEntity> => {
    return await getResData(axios.get(`/entities/identifier/${identifier}`));
  },
};
