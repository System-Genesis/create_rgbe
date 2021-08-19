import axios from 'axios';
import { getResData } from './getResData';
import { connectDiToEntity } from '../redis/connectDiToEntityRedis';

export const ogApi = {
  create: async (og: object) => await getResData(axios.post(`/groups`, og)),
  get: async (hierarchy: string) => {
    return await getResData(axios.get(`/groups/${encodeURIComponent(hierarchy)}`));
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
  connectToEntity: async (entityId: string, diId: string) => {
    // send to queue
    connectDiToEntity(entityId, diId);
  },
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(
    axios.patch(`/entities/${entityId}/connectDigitalIdentity`, {
      digitalIdentityUniqueId: diId,
    })
  );
};

export const roleApi = {
  get: async (id: string) => await getResData(axios.get(`/roles/${id}`)),
  create: async (role: object) => await getResData(axios.post(`/roles`, role)),
  update: async (id: string, role: object) => await getResData(axios.patch(`/roles/${id}`, role)),

  connectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return await getResData(
      axios.patch(`/roles/${roleId}/connectDigitalIdentity`, {
        digitalIdentityUniqueId,
      })
    );
  },

  connectToOG: async (id: string, groupId: string) => {
    return await getResData(axios.patch(`/roles/${id}/moveToGroup`, { groupId }));
  },
};
