import axios from 'axios';
import config from '../config/env.config';
import { getResData } from './getResData';
import { connectDiToEntityQueue } from '../rabbit/rabbit';

const api = config.krtflApi;

export const ogApi = {
  create: async (og: object) => await getResData(axios.post(`${api}/groups`, og)),
  get: async (hierarchy: string) => {
    return await getResData(axios.get(`${api}/groups/${encodeURIComponent(hierarchy)}`));
  },
  update: async (id: string, og: object) => {
    return await getResData(axios.patch(`${api}/groups/${id}`, og));
  },
};

export const diApi = {
  get: async (di: string) => await getResData(axios.get(`${api}/digitalIdentities/${di}`)),
  create: async (di: object) => await getResData(axios.post(`${api}/digitalIdentities`, di)),
  update: async (id: string, di: object) => {
    return await getResData(axios.patch(`${api}/digitalIdentities/${id}`, di));
  },
  connectToEntity: async (entityId: string, diId: string) => {
    // send to queue
    connectDiToEntityQueue(entityId, diId);
  },
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(
    axios.patch(`${api}/entities/${entityId}/connectDigitalIdentity`, {
      digitalIdentityUniqueId: diId,
    })
  );
};

export const roleApi = {
  get: async (id: string) => await getResData(axios.get(`${api}/roles/${id}`)),
  create: async (role: object) => await getResData(axios.post(`${api}/roles`, role)),
  update: async (id: string, role: object) =>
    await getResData(axios.patch(`${api}/roles/${id}`, role)),

  connectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return await getResData(
      axios.patch(`${api}/roles/${roleId}/connectDigitalIdentity`, {
        digitalIdentityUniqueId,
      })
    );
  },

  connectToOG: async (id: string, groupId: string) => {
    return await getResData(axios.patch(`${api}/roles/${id}/moveToGroup`, { groupId }));
  },
};
