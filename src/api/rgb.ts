import axios from 'axios';
import config from '../config/env.config';

export const get = {
  og: async (og: string) => (await axios.get(`${config.krtflApi}/og/${og}`)).data,
  di: async (di: string) => (await axios.get(`${config.krtflApi}/di/${di}`)).data,
  role: async (role: string) => (await axios.get(`${config.krtflApi}/role/${role}`)).data,
};

export const update = {
  og: async (og: object) => (await axios.patch(`${config.krtflApi}/og`, og)).data,
  di: async (di: object) => (await axios.patch(`${config.krtflApi}/di`, di)).data,
  role: async (role: object) => (await axios.patch(`${config.krtflApi}/role`, role)).data,
};

export const create = {
  og: async (og: object) => (await axios.post(`${config.krtflApi}/og`, og)).data,
  di: async (di: object) => (await axios.post(`${config.krtflApi}/di`, di)).data,
  role: async (role: object) => (await axios.post(`${config.krtflApi}/role`, role)).data,
};

export const connect = {
  ogToRole: async (role: string, og: string) => {
    return (await axios.post(`${config.krtflApi}/og`, { og, role })).data;
  },
  diToRole: async (role: string, di: string) => {
    return (await axios.post(`${config.krtflApi}/di`, { di, role })).data;
  },
  diToEntity: async (entityId: string, di: string) => {
    return (await axios.post(`${config.krtflApi}/di`, { di, entityId })).data;
  },
};
