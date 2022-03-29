import axios from 'axios';
import { getResData } from './utils/getResData';

export const roleApi = {
  get: async (id: string) => await getResData(axios.get(`/roles/${id}`)),
  delete: async (id: string) => await getResData(axios.delete(`/roles/${id}`)),
  create: async (role: object) => await getResData(axios.post(`/roles`, role)),
  update: async (id: string, role: object) => await getResData(axios.patch(`/roles/${id}`, role)),

  connectToDI: async (roleId: string, diUniqueId: string) => {
    return await getResData(axios.put(`/roles/${roleId}/digitalIdentity/${diUniqueId}`));
  },

  disconnectToDI: async (roleId: string, diUniqueId: string) => {
    return await getResData(axios.delete(`/roles/${roleId}/digitalIdentity/${diUniqueId}`));
  },

  connectToOG: async (id: string, groupId: string) => {
    return await getResData(axios.put(`/roles/${id}/group/${groupId}`));
  },
};
