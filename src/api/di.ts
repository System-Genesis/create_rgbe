import axios from 'axios';
import { getResData } from './utils/axios/axiosWrap';
import { connectDiToEntity } from '../redis/connectDiToEntityRedis';
import { di } from '../types/rgbType';

export const diApi = {
  get: async (di: string) => await getResData(axios.get(`/digitalIdentities/${di}?expanded=true`)),
  create: async (di: object) => await getResData(axios.post(`/digitalIdentities`, di)),
  update: async (id: string, di: object) => {
    return await getResData(axios.patch(`/digitalIdentities/${id}`, di));
  },
  connectToEntity: async (entityIdentifier: string, di: di) => {
    connectDiToEntity(entityIdentifier, di);
  },
  delete: async (di: string) => await getResData(axios.delete(`/digitalIdentities/${di}`)),
};

export const connectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(axios.put(`/entities/${entityId}/digitalIdentity/${diId}`, {}));
};

export const disconnectDiToEntityApi = async (entityId: string, diId: string) => {
  return await getResData(axios.delete(`/entities/${entityId}/digitalIdentity/${diId}`));
};
