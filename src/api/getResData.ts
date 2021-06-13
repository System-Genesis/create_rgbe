import { AxiosResponse } from 'axios';
import { logError } from './../logger/logger';

export const getResData = (res: AxiosResponse<any>) => {
  const okStatus = res.status >= 200 && res.status < 400;

  if (okStatus) return res.data;
  if (res.status >= 400) logError(`Status code ${res.data}`, res.data);

  return null;
};
