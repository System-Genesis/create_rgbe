import axios from 'axios';
import config from '../config/env.config';
import { getResData } from './getResData';
import { menash } from 'menashmq';
import envConfig from '../config/env.config';
import { logInfo } from '../logger/logger';

const api = config.krtflApi;

export const ogApi = {
  create: async (og: object) => getResData(await axios.post(`${api}/groups`, og)),
  get: async (hierarchy: string) => {
    return getResData(await axios.get(`${api}/groups/${encodeURIComponent(hierarchy)}`));
  },
  update: async (id: string, og: object) => {
    return getResData(await axios.patch(`${api}/groups/${id}`, og));
  },
};

export const diApi = {
  get: async (di: string) => getResData(await axios.get(`${api}/digitalIdentities/${di}`)),
  create: async (di: object) => getResData(await axios.post(`${api}/digitalIdentities`, di)),
  update: async (id: string, di: object) => {
    return getResData(await axios.patch(`${api}/digitalIdentities/${id}`, di));
  },
  connectToEntity: async (entityId: string, diId: string) => {
    // send to queue
    logInfo(`Send to connectDiToEntity queue entity: ${entityId}, diId: ${diId}`);
    await menash.send(envConfig.rabbit.connectDiToEntity, { entityId, di: diId });
  },
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return getResData(
    await axios.patch(`${api}/entities/${entityId}/connectDigitalIdentity`, {
      digitalIdentityUniqueId: diId,
    })
  );
};

export const roleApi = {
  get: async (id: string) => getResData(await axios.get(`${api}/roles/${id}`)),
  create: async (role: object) => getResData(await axios.post(`${api}/roles`, role)),
  update: async (id: string, role: object) =>
    getResData(await axios.patch(`${api}/roles/${id}`, role)),

  connectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return getResData(
      await axios.post(`${api}/roles/${roleId}/connectDigitalIdentity`, {
        digitalIdentityUniqueId,
      })
    );
  },

  connectToOG: async (id: string, groupId: string) => {
    return getResData(await axios.post(`${api}/roles/${id}/moveToGroup`, { groupId }));
  },
};
