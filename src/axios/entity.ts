import axios from 'axios';
import { entity } from '../types/entityType';
import config from '../config/env.config';

export const createEntity = async (entity: entity) => {
  await axios.post(`${config.krtflApi}/create`, entity);
};

export const updateEntity = async (entity: entity) => {
  await axios.patch(`${config.krtflApi}/update`, entity);
};

export const getEntity = async (id: string) => {
  const res = await axios.get(`${config.krtflApi}/id/${id}`);
  return res.data;
};
