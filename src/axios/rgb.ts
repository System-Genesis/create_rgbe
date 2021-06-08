import axios from 'axios';
import config from '../config/env.config';

export const get = {
  og: async (og: string) => await axios.get(`${config.krtflApi}/og/${og}`),
  di: async (di: string) => await axios.get(`${config.krtflApi}/di/${di}`),
  role: async (role: string) => await axios.get(`${config.krtflApi}/role/${role}`),
};

export const update = {
  og: async (og: object) => await axios.patch(`${config.krtflApi}/og`, og),
  di: async (di: object) => await axios.patch(`${config.krtflApi}/di`, di),
  role: async (role: object) => await axios.patch(`${config.krtflApi}/role`, role),
};

export const create = {
  og: async (og: object) => await axios.post(`${config.krtflApi}/og`, og),
  di: async (di: object) => await axios.post(`${config.krtflApi}/di`, di),
  role: async (role: object) => await axios.post(`${config.krtflApi}/role`, role),
};
