import axios, { AxiosRequestConfig } from 'axios';
import envConfig from '../../../config/env.config';
import config from '../../../config/env.config';
import { tokenWrapIns } from '../tokenWrap';

axios.interceptors.request.use(async (req: AxiosRequestConfig) => {
  // for mirror req use mirror baseurl no authorization needed
  // for kartoffel req use kartoffel baseurl handle authorization
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
