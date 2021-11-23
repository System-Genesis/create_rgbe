import axios from 'axios';
import { getResData } from './getResData';
import { connectDiToEntity } from '../redis/connectDiToEntityRedis';
import { di, og, postOg } from '../types/rgbType';

export const ogApi = {
  create: async (og: og) => {
    const postOg: postOg = {
      name: og.name,
      source: og.source,
      directGroup: og.directGroup,
    };

    return await getResData(axios.post(`/groups`, postOg));
  },
  getByHierarchy: async (hierarchy: string) => {
    return await getResData(axios.get(`/groups/hierarchy/${encodeURIComponent(hierarchy)}`));
  },
  update: async (id: string, og: object) => {
    return await getResData(axios.patch(`/groups/${id}`, og));
  },
};

export const diApi = {
  get: async (di: string) => await getResData(axios.get(`/digitalIdentities/${di}`)),
  create: async (di: object) => await getResData(axios.post(`/digitalIdentities`, di)),
  update: async (id: string, di: object) => {
    return await getResData(axios.patch(`/digitalIdentities/${id}`, di));
  },
  connectToEntity: async (entityIdentifier: string, di: di) => {
    connectDiToEntity(entityIdentifier, di);
  },
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(axios.put(`/entities/${entityId}/digitalIdentity/${diId}`));
};

export const disconnectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(axios.delete(`/entities/${entityId}/digitalIdentity/${diId}`));
};

export const roleApi = {
  get: async (id: string) => await getResData(axios.get(`/roles/${id}`)),
  create: async (role: object) => await getResData(axios.post(`/roles`, role)),
  update: async (id: string, role: object) => await getResData(axios.patch(`/roles/${id}`, role)),

  connectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return await getResData(axios.put(`/roles/${roleId}/digitalIdentity/${digitalIdentityUniqueId}`));
  },

  disconnectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return await getResData(axios.delete(`/roles/${roleId}/digitalIdentity/${digitalIdentityUniqueId}`));
  },

  connectToOG: async (id: string, groupId: string) => {
    return await getResData(axios.put(`/roles/${id}/group/${groupId}`));
  },
};
