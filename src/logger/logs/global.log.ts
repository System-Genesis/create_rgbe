import logger from 'logger-genesis';

const ERROR_RESPONSE = (error: { response: { data: any }; config: any; code: any; message: any }) => {
  const erData = error?.response?.data;

  const erConfig = error?.config;

  const resMgs = `Response ${JSON.stringify(erData?.message || erData || error?.code || '')}`;
  const reqMgs = `Request ${erConfig?.method}:${erConfig?.url}`;

  logger.warn(!resMgs.includes('Not found'), 'APP', `Request fail ${resMgs}`, `${reqMgs} ${error?.message}`, {
    url: erConfig?.url,
    data: erConfig?.data,
  });
};

const INITIAL = (hour: number, minute: number) => {
  logger.info(true, 'SYSTEM', 'Daily run', `Time: ${hour}:${minute}`);
};

const START = () => logger.info(true, 'SYSTEM', 'Daily run', `start Daily run`);

export default { ERROR_RESPONSE, DAILY: { INITIAL, START } };
