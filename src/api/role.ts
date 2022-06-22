import { AxiosReqEnum } from '../types/axiosReqType';
import { axiosWrapKartoffel } from './utils/axiosWrapKartoffel';

export const roleApi = {
  get: async (id: string) => await axiosWrapKartoffel(AxiosReqEnum.get, `/roles/${id}`),
  delete: async (id: string) => await axiosWrapKartoffel(AxiosReqEnum.delete, `/roles/${id}`),
  create: async (role: object) => await axiosWrapKartoffel(AxiosReqEnum.post, `/roles`, role),
  update: async (id: string, role: object) => await axiosWrapKartoffel(AxiosReqEnum.patch, `/roles/${id}`, role),

  connectToDI: async (roleId: string, diUniqueId: string) => {
    return await axiosWrapKartoffel(AxiosReqEnum.put, `/roles/${roleId}/digitalIdentity/${diUniqueId}`);
  },

  disconnectToDI: async (roleId: string, diUniqueId: string) => {
    return await axiosWrapKartoffel(AxiosReqEnum.delete, `/roles/${roleId}/digitalIdentity/${diUniqueId}`);
  },

  connectToOG: async (id: string, groupId: string) => {
    return await axiosWrapKartoffel(AxiosReqEnum.put, `/roles/${id}/group/${groupId}`);
  },
  disConnectFromOG: async (id: string, groupId: string) => {
    return await axiosWrapKartoffel(AxiosReqEnum.delete, `/roles/${id}/group/${groupId}`);
  },
};
