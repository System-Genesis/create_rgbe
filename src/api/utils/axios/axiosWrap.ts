import { AxiosResponse } from 'axios';
import logger from 'logger-genesis';

export const getResData = async (axiosReq: Promise<AxiosResponse<any>>) => {
  try {
    const res = await axiosReq;
    return res.data;
  } catch (error: any) {
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
