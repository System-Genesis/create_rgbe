import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { token } from "../auth/spike";
import config from "../config/env.config";
import { sleep } from "../util/utils";
import { logWarn } from "./../logger/logger";

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
      !error.response?.data?.id &&
      ((error.config && error.response && error.response.status === 401) ||
        error.response.status === 503 ||
        (error.config.method === "post" &&
          error.config.url.includes("group")) ||
        error.code === "ECONNREFUSED" ||
        error.message.toLowerCase().includes("spike"))
    ) {
      if (reRequestCount < 500) {
        console.log("rereq");
        reRequestCount++;
        await sleep(3000);
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
    if (error.response?.data?.id) { 
      return {
        id: error.response.data.id,
      };
    }
    logWarn(
      `Response ${error.response?.data || error.code}, status: ${
        error.response?.status || "no status"
      }`,
      {
        url: error.config?.url,
        data: JSON.parse(error.config?.data || "{}"),
        msg: error.message,
      }
    );

    return null;
  }
};
