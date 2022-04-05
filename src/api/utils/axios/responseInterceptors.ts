import axios from 'axios';
import config from '../../../config/env.config';
import { tokenWrapIns } from '../tokenWrap';

let reRequestCount = 0;

const isError = (error: any) => {
  return (
    !error?.response?.data?.id &&
    ((error?.config && error?.response && error?.response?.status === 401) ||
      error?.response?.status === 503 ||
      (error?.config?.method === 'post' && error?.config?.url.includes('group')) ||
      error?.code === 'ECONNREFUSED' ||
      error?.response?.status === 409 ||
      error?.message?.toLowerCase().includes('spike'))
  );
};

axios.interceptors.response.use(
  (res) => {
    if (!res.config.url?.includes(config.mirrorUnique)) {
      reRequestCount = 0;
    }
    return res;
  },
  async (error: any) => {
    if (error.config.url?.includes(config.mirrorUnique)) {
      return Promise.reject(error);
    }

    // Get new token if error reason is unauthorized
    // OR  ReRequest if connection error
    // OR  ReRequest if conflict error
    // OR  SPIKE didn't give token
    // after 500 error in a row stop resend
    if (isError(error)) {
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
