import logger from 'logger-genesis';

export const handleResponseError = (error: any): { id: string } | undefined => {
  const erData = error?.response?.data;

  // if error has id it means that the req fail because already exist
  // so we can return the id of existing obg
  if (erData?.id) return { id: erData.id };

  const erConfig = error?.config;

  const resMgs = `Response ${JSON.stringify(erData?.message || erData || error?.code || '')}`;
  const reqMgs = `Request ${erConfig?.method}:${erConfig?.url}`;

  logger.warn(!resMgs.includes('Not found'), 'APP', `Request fail ${resMgs}`, `${reqMgs} ${error?.message}`, {
    url: erConfig?.url,
    data: erConfig?.data,
  });

  return;
};
