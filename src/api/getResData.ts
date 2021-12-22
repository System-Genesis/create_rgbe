import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from 'logger-genesis';
import { token } from '../auth/spike';
import envConfig from '../config/env.config';
import config from '../config/env.config';
import { sleep } from '../util/utils';

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  if (envConfig.isSpike) {
    req.headers.authorization = await token();
  }
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
      !error.response?.data?.id &&
      ((error.config && error.response && error.response.status === 401) ||
        error.response.status === 503 ||
        (error.config.method === 'post' && error.config.url.includes('group')) ||
        error.code === 'ECONNREFUSED' ||
        error.message.toLowerCase().includes('spike'))
    ) {
      if (reRequestCount < 500) {
        console.log(`rereq ${JSON.stringify(error.response?.data || error.code)}`);
        reRequestCount++;
        return await axios.request(error.config);
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
    const erData = error.response?.data;

    if (erData?.id) return { id: erData.id };

    const erConfig = error.config;

    logger.warn(true, 'APP', `Response ${JSON.stringify(erData?.message || erData || error.code)}`, error.message, {
      url: erConfig?.url,
      data: erConfig?.data,
    });

    return null;
  }
};
