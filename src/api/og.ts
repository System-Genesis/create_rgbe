import { AxiosReqEnum } from '../types/axiosReqType';
import { og, postOg } from '../types/rgbType';
import { axiosWrapKartoffel } from './utils/axiosWrapKartoffel';

export const ogApi = {
  create: async (og: og) => {
    const postOg: postOg = {
      name: og.name,
      source: og.source,
      directGroup: og.directGroup,
    };

    return await axiosWrapKartoffel(AxiosReqEnum.post, `/groups`, postOg);
  },
  getByHierarchy: async (hierarchy: string) => {
    return await axiosWrapKartoffel(AxiosReqEnum.get, `/groups/hierarchy/${encodeURIComponent(hierarchy)}`);
  },
  update: async (id: string, og: object) => {
    return await axiosWrapKartoffel(AxiosReqEnum.patch, `/groups/${id}`, og);
  },
};
