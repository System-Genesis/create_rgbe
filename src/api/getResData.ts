import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { token } from '../auth/spike';
import config from '../config/env.config';
import { logWarn } from './../logger/logger';

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  req.headers.authorization = await token();
  req.baseURL = config.krtflApi;
  return req;
});

axios.interceptors.response.use(
  (r) => r,
  async (error) => {
    // Get new token if error reason is unauthorized
    if (error.config && error.response && error.response.status === 401) {
      error.config.headers.authorization = await token();
      return axios.request(error.config);
    }

    // ReRequest if connection error
    if (error.message === 'connect ECONNREFUSED 127.0.0.1:7709') {
      return axios.request(error.config);
    }

    return Promise.reject(error);
  }
);

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
