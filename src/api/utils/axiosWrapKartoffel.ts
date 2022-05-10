import { handleResponseError } from './responseError';
import { AxiosReqEnum } from '../../types/axiosReqType';
import axios, { AxiosError } from 'axios';
import config from '../../config/env.config';
import { tokenWrap } from './tokenWrap';

let reRequestCount = 0;

export async function axiosWrapKartoffel(axiosFunc: AxiosReqEnum, url: string, body?: object) {
  const header = { headers: { Authorization: config.isSpike ? await new tokenWrap().getToken(false) : null } };
  const fullUrl = config.krtflApi + url;

  try {
    const res = ['get' || 'delete'].includes(axiosFunc.toLowerCase())
      ? await axios[axiosFunc](fullUrl, header)
      : await axios[axiosFunc](fullUrl, body, header);

    return res.data;
  } catch (error: any) {
    const data = kartoffelError(error as AxiosError, url);
    return data || null;
  }
}

async function kartoffelError(error: AxiosError, url: string) {
  if (isNeedToReRequest(error)) {
    if (error?.response?.status === 401) {
      await new tokenWrap().getToken(true);
    }
    if (reRequestCount < 5) {
      console.log(`rereq ${JSON.stringify(error?.response?.data || error?.code)}`);
      reRequestCount++;
      return await axiosWrapKartoffel(error.config.method! as AxiosReqEnum, url, error.config.data);
    }
  } else {
    reRequestCount = 0;
  }

  const data = handleResponseError(error);
  return data || null;
}

// Get new token if error reason is unauthorized
// OR  ReRequest if connection error
// OR  ReRequest if conflict error
// OR  SPIKE didn't give token
// after 500 error in a row stop resend
function isNeedToReRequest(error: any) {
  return (
    !error?.response?.data?.id &&
    ((error?.config && error?.response && error?.response?.status === 401) ||
      error?.response?.status === 503 ||
      (error?.config?.method === 'post' && error?.config?.url.includes('group')) ||
      error?.code === 'ECONNREFUSED' ||
      error?.response?.status === 409 ||
      error?.message?.toLowerCase().includes('spike'))
  );
}
