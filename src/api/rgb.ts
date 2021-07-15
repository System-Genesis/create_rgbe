import axios from 'axios';
import config from '../config/env.config';
import { getResData } from './getResData';
import { connectDiToEntityQueue } from '../rabbit/rabbit';
import getToken from '../auth/spike';

const api = config.krtflApi;

export const ogApi = {
  create: async (og: object) =>
    await getResData(axios.post(`${api}/groups`, og, getToken())),
  get: async (hierarchy: string) => {
    return await getResData(
      axios.get(`${api}/groups/${encodeURIComponent(hierarchy)}`, getToken())
    );
  },
  update: async (id: string, og: object) => {
    return await getResData(axios.patch(`${api}/groups/${id}`, og, getToken()));
  },
};

export const diApi = {
  get: async (di: string) =>
    await getResData(axios.get(`${api}/digitalIdentities/${di}`, getToken())),
  create: async (di: object) =>
    await getResData(axios.post(`${api}/digitalIdentities`, di, getToken())),
  update: async (id: string, di: object) => {
    return await getResData(
      axios.patch(`${api}/digitalIdentities/${id}`, di, getToken())
    );
  },
  connectToEntity: async (entityId: string, diId: string) => {
    // send to queue
    connectDiToEntityQueue(entityId, diId);
  },
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(
    axios.patch(
      `${api}/entities/${entityId}/connectDigitalIdentity`,
      {
        digitalIdentityUniqueId: diId,
      },
      getToken()
    )
  );
};

export const roleApi = {
  get: async (id: string) =>
    await getResData(axios.get(`${api}/roles/${id}`, getToken())),
  create: async (role: object) =>
    await getResData(axios.post(`${api}/roles`, role, getToken())),
  update: async (id: string, role: object) =>
    await getResData(axios.patch(`${api}/roles/${id}`, role, getToken())),

  connectToDI: async (roleId: string, digitalIdentityUniqueId: string) => {
    return await getResData(
      axios.patch(
        `${api}/roles/${roleId}/connectDigitalIdentity`,
        {
          digitalIdentityUniqueId,
        },
        getToken()
      )
    );
  },

  connectToOG: async (id: string, groupId: string) => {
    return await getResData(
      axios.patch(`${api}/roles/${id}/moveToGroup`, { groupId }, getToken())
    );
  },
};
