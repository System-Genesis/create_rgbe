import axios, { AxiosResponse } from 'axios';
import config from '../config/env.config';

const api = config.krtflApi;

export const getResponseData = (res: AxiosResponse<any>) => {
  return res.status >= 200 && res.status < 400 ? null : res.data;
};

export const ogApi = {
  get: async (og: string) => getResponseData(await axios.get(`${api}/og/${og}`)),
  create: async (og: object) => getResponseData(await axios.post(`${api}/og`, og)),
  update: async (id: string, og: object) => getResponseData(await axios.patch(`${api}/${id}`, og)),
};

export const diApi = {
  get: async (di: string) => getResponseData(await axios.get(`${api}/digitalIdentities/${di}`)),
  create: async (di: object) => getResponseData(await axios.post(`${api}/digitalIdentities`, di)),
  update: async (id: string, di: object) => {
    return getResponseData(await axios.patch(`${api}/digitalIdentities/${id}`, di));
  },
  connectToEntity: async (entityId: string, di: string) => {
    return getResponseData(await axios.post(`${api}/di`, { di, entityId }));
  },
};

export const roleApi = {
  get: async (id: string) => getResponseData(await axios.get(`${api}/roles/${id}`)),
  create: async (role: object) => getResponseData(await axios.post(`${api}/roles`, role)),
  update: async (id: string, role: object) =>
    getResponseData(await axios.patch(`${api}/roles/${id}`, role)),
  connectToDI: async (id: string, digitalIdentityUniqueId: string) => {
    return getResponseData(
      await axios.post(`${api}/roles/${id}/roles/{roleId}/connectDigitalIdentity`, {
        digitalIdentityUniqueId,
      })
    );
  },
  connectToOG: async (id: string, groupId: string) => {
    return getResponseData(await axios.post(`${api}/roles/${id}/moveToGroup`, { groupId }));
  },
};
