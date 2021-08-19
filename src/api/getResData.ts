import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { token } from '../auth/spike';
import config from '../config/env.config';
import { logWarn } from './../logger/logger';

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  req.headers.authorization = await token();
  req.baseURL += config.krtflApi;
  return req;
});

export const getResData = async (axiosReq: Promise<AxiosResponse<any>>) => {
  try {
    const res = await axiosReq;
    return res.data;
  } catch (error) {
    logWarn(`Response ${error.response?.data}, status:  ${error.response?.status}`, {
      url: error.config?.url,
      data: JSON.parse(error.config?.data || '{}'),
      msg: error.message,
    });

    return null;
  }
};
