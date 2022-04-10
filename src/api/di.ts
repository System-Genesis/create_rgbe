import { connectDiToEntity } from '../redis/connectDiToEntityRedis';
import { AxiosReqEnum } from '../types/axiosReqType';
import { di } from '../types/rgbType';
import { axiosWrapKartoffel } from './utils/axiosWrapKartoffel';

export const diApi = {
  get: async (di: string) => await axiosWrapKartoffel(AxiosReqEnum.get, `/digitalIdentities/${di}?expanded=true`),
  create: async (di: object) => await axiosWrapKartoffel(AxiosReqEnum.post, `/digitalIdentities`, di),
  update: async (id: string, di: object) => {
    return await axiosWrapKartoffel(AxiosReqEnum.patch, `/digitalIdentities/${id}`, di);
  },
  connectToEntity: async (entityIdentifier: string, di: di) => {
    connectDiToEntity(entityIdentifier, di);
  },
  delete: async (di: string) => await axiosWrapKartoffel(AxiosReqEnum.delete, `/digitalIdentities/${di}`),
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await axiosWrapKartoffel(AxiosReqEnum.put, `/entities/${entityId}/digitalIdentity/${diId}`, {});
};

export const disconnectDiToEntityApi = async (entityId: string, diId: string) => {
  return await axiosWrapKartoffel(AxiosReqEnum.delete, `/entities/${entityId}/digitalIdentity/${diId}`);
};
