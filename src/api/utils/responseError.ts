import logs from '../../logger/logs';

export const handleResponseError = (error: any): { id: string } | undefined => {
  const erData = error?.response?.data;

  // if error has id it means that the req fail because already exist
  // so we can return the id of existing obg
  if (erData?.id) return { id: erData.id };

  logs.ERROR_RESPONSE(error);

  return;
};
