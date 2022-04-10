import { handleResponseError } from './responseError';
import { AxiosReqEnum } from '../../types/axiosReqType';
import axios from 'axios';
import config from '../../config/env.config';

export async function axiosWrapMirror(axiosFunc: AxiosReqEnum, url: string, body?: object) {
  const fullUrl = config.mirrorApi + url;

  try {
    const res = body ? await axios[axiosFunc](fullUrl, body) : await axios[axiosFunc](fullUrl);
    return res.data;
  } catch (error) {
    handleResponseError(error);
    return null;
  }
}
