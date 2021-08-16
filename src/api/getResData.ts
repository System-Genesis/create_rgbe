import { AxiosResponse } from 'axios';
import { logError } from './../logger/logger';

export const getResData = async (req: Promise<AxiosResponse<any>>) => {
  try {
    const res = await req;
    return res.data;
  } catch (error) {
    logError(`Response ${error.response.data}, status:  ${error.response.status}`, {
      url: error.config?.url,
      data: JSON.parse(error.config?.data),
      msg: error.message,
    });

    return null;
  }
};
