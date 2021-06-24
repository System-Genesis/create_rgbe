import { AxiosResponse } from 'axios';
import { logError } from './../logger/logger';

export const getResData = async (req: Promise<AxiosResponse<any>>) => {
  try {
    return (await req).data;
  } catch (error) {
    logError(`Can't get response`, `${error}`.split('\n'));
    return null;
  }
};
