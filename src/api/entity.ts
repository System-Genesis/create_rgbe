import axios from 'axios';
import { krtflEntity, entity } from '../types/entityType';
import config from '../config/env.config';
import { getResponseData } from './rgb';

export const entityApi = {
  createEntity: async (entity: entity) => {
    return getResponseData(await axios.post(`${config.krtflApi}/entities`, entity));
  },
  updateEntity: async (id: string, entity: entity) => {
    return getResponseData(await axios.patch(`${config.krtflApi}/entities/${id}`, entity));
  },
  deleteEntity: async (id: string) => {
    return getResponseData(await axios.delete(`${config.krtflApi}/entities/${id}`));
  },
  getEntity: async (id: string): Promise<krtflEntity> => {
    return getResponseData(await axios.get(`${config.krtflApi}/entities/${id}`));
  },
};
