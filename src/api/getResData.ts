import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { token } from '../auth/spike';
import config from '../config/env.config';
import logger from 'logger-genesis';

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  req.headers.authorization = await token();
  req.baseURL = config.krtflApi;
  return req;
});

let reRequestCount = 0;

axios.interceptors.response.use(
  (res) => {
    reRequestCount = 0;
    return res;
  },
  async (error) => {
    // Get new token if error reason is unauthorized
    // OR  ReRequest if connection error
    // OR  SPIKE didn't give token
    // after 500 error in a row stop resend
    if (
      (error.config && error.response && error.response.status === 401) ||
      error.code === 'ECONNREFUSED' ||
      error.message.toLowerCase().includes('spike')
    ) {
      if (reRequestCount < 500) {
        reRequestCount++;
        return axios.request(error.config);
      }
    } else {
      reRequestCount = 0;
    }

    return Promise.reject(error);
  }
);

export const getResData = async (axiosReq: Promise<AxiosResponse<any>>) => {
  try {
    const res = await axiosReq;
    return res.data;
  } catch (error: any) {
    logger.logWarn(
      true,
      `Response ${error.response?.data}, status:  ${error.response?.status}`,
      'APP',
      error.message,
      {
        url: error.config?.url,
        data: JSON.parse(error.config?.data || '{}'),
      }
    );

    return null;
  }
};
