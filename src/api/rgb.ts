import axios from 'axios';
import config from '../config/env.config';

const api = config.krtflApi;

export const ogApi = {
  get: async (og: string) => (await axios.get(`${api}/og/${og}`)).data,
  create: async (og: object) => (await axios.post(`${api}/og`, og)).data,
  update: async (id: string, og: object) => (await axios.patch(`${api}/${id}`, og)).data,
};

export const diApi = {
  get: async (di: string) => (await axios.get(`${api}/digitalIdentities/${di}`)).data,
  create: async (di: object) => (await axios.post(`${api}/digitalIdentities`, di)).data,
  update: async (id: string, di: object) => {
    return (await axios.patch(`${api}/digitalIdentities/${id}`, di)).data;
  },
  connectToEntity: async (entityId: string, di: string) => {
    return (await axios.post(`${api}/di`, { di, entityId })).data;
  },
};

export const roleApi = {
  get: async (id: string) => (await axios.get(`${api}/roles/${id}`)).data,
  create: async (role: object) => (await axios.post(`${api}/roles`, role)).data,
  update: async (id: string, role: object) => (await axios.patch(`${api}/roles/${id}`, role)).data,
  connectToDI: async (id: string, digitalIdentityUniqueId: string) => {
    return (
      await axios.post(`${api}/roles/${id}//roles/{roleId}/connectDigitalIdentity`, {
        digitalIdentityUniqueId,
      })
    ).data;
  },
  connectToOG: async (id: string, groupId: string) => {
    return (await axios.post(`${api}/roles/${id}/moveToGroup`, { groupId })).data;
  },
};
