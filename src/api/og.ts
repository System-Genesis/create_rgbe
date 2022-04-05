import axios from 'axios';
import { getResData } from './utils/axios/axiosWrap';
import { og, postOg } from '../types/rgbType';

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
