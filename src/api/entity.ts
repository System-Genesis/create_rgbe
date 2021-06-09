import axios from 'axios';
import { entity } from '../types/entityType';
import config from '../config/env.config';

export const createEntity = async (entity: entity) => {
  return (await axios.post(`${config.krtflApi}/entities`, entity)).data;
};

export const updateEntity = async (id: string, entity: entity) => {
  return (await axios.patch(`${config.krtflApi}/entities/${id}`, entity)).data;
};

export const deleteEntity = async (id: string) => {
  return (await axios.delete(`${config.krtflApi}/entities/${id}`)).data;
};

export const getEntity = async (id: string): Promise<entity> => {
  return (await axios.get(`${config.krtflApi}/entities/${id}`)).data;
};
