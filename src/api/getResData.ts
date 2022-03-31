import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from 'logger-genesis';
import { token } from '../auth/spike';
import envConfig from '../config/env.config';
import config from '../config/env.config';

// TODO (N): refactor tokenWrap or use other spike library to avoid redis clients
class tokenWrap {
  token?: string;

  constructor() {}

  async getToken(expired: Boolean): Promise<string> {
    if (expired) {
      this.token = await token()!();
      return this.token;
    } else if (!this.token) {
      this.token = await token()!();
      return this.token;
    } else {
      return this.token;
    }
  }
}

const tokenWrapIns = new tokenWrap();

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  // for mirror req use mirror baseurl no authorization needed
  // for kartoffel req use kartoffel baseurl handle authorization
  // TODO (N): just seperate between the api's and manage multiple axios instances if necessary
  if (req.url?.includes(config.mirrorUnique)) {
    req.baseURL = config.mirrorApi;
  } else {
    if (envConfig.isSpike) {
      req.headers.authorization = await tokenWrapIns.getToken(false);
    }
    req.baseURL = config.krtflApi;
  }
  return req;
});

let reRequestCount = 0;

axios.interceptors.response.use(
  (res) => {
    if (!res.config.url?.includes(config.mirrorUnique)) {
      // TODO (N)
      reRequestCount = 0;
    }
    return res;
  },
  async (error) => {
    if (error.config.url?.includes(config.mirrorUnique)) {
      return Promise.reject(error);
    }
    // TODO (N): The following conditions might be not necessary now, consider building a function to that
    // Get new token if error reason is unauthorized
    // OR  ReRequest if connection error
    // OR  ReRequest if conflict error
    // OR  SPIKE didn't give token
    // after 500 error in a row stop resend
    if (
      !error?.response?.data?.id &&
      ((error?.config && error?.response && error?.response?.status === 401) ||
        error?.response?.status === 503 ||
        (error?.config?.method === 'post' && error?.config?.url.includes('group')) ||
        error?.code === 'ECONNREFUSED' ||
        error?.response?.status === 409 ||
        error?.message?.toLowerCase().includes('spike'))
    ) {
      if (error?.response?.status === 401) {
        await tokenWrapIns.getToken(true);
      }
      if (reRequestCount < 500) {
        console.log(`rereq ${JSON.stringify(error?.response?.data || error?.code)}`);
        reRequestCount++;
        return await axios.request(error?.config);
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
    // TODO (N): should be more information about why error gives id (group doesnt exists?) - shouldnt be here
    const erData = error?.response?.data;

    if (erData?.id) return { id: erData.id };

    const erConfig = error?.config;

    const resMgs = `Response ${JSON.stringify(erData?.message || erData || error?.code || '')}`;
    const reqMgs = `Request ${erConfig?.method}:${erConfig?.url}`;

    logger.warn(!resMgs.includes('Not found'), 'APP', `Request fail ${resMgs}`, `${reqMgs} ${error?.message}`, {
      url: erConfig?.url,
      data: erConfig?.data,
    });

    return null;
  }
};
