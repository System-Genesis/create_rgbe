import logger from 'logger-genesis';

const CREATED = (uniqueId: string) => {
  logger.info(true, 'APP', 'DI created', `${uniqueId} created`, {
    uniqueId: uniqueId,
  });
};
const FAIL_TO_CREATE = (uniqueId: string) => {
  logger.error(true, 'APP', 'DI not created', `${uniqueId} not created`, {
    uniqueId: uniqueId,
  });
};
const UPDATED = (uniqueId: string, diDiff: object) => {
  const msgLog = `uniqueId: ${uniqueId}, updated: ${Object.keys(diDiff)}`;
  const extraFieldsLog = { uniqueId: uniqueId, updated: diDiff };
  logger.info(true, 'APP', 'DI updated', msgLog, extraFieldsLog);
};
const FAIL_TO_UPDATE = (uniqueId: string, diDiff: object) => {
  const msgLog = `uniqueId: ${uniqueId}, updated: ${Object.keys(diDiff)}`;
  const extraFieldsLog = { uniqueId: uniqueId, updated: diDiff };
  logger.warn(true, 'APP', 'DI fail to updated', msgLog, extraFieldsLog);
};

const ALREADY_UP_TO_DATE = (uniqueId: string) => {
  logger.warn(true, 'APP', 'DI already up to date', `uniqueId: ${uniqueId}`, {
    uniqueId: uniqueId,
  });
};

const HASNT_ENTITY = (uniqueId: string) => {
  logger.warn(true, 'APP', 'No entity to connect', `uniqueId: ${uniqueId}`, {
    uniqueId: uniqueId,
  });
};
const ALREADY_CONNECTED = (uniqueId: string, entityIdentifier: string) => {
  const connectMsg = `di: ${uniqueId} => entity: ${entityIdentifier}`;
  logger.info(true, 'APP', 'DI already connected', connectMsg);
};

const FAIL_TO_DISCONNECT = (uniqueId: string, source: string, entityId: string) => {
  const errTitle = `source: ${source} di: ${uniqueId} entity: ${entityId}`;

  logger.error(true, 'APP', `Fail to disconnect di`, errTitle);
};

const FAIL_TO_DELETE = (uniqueId: string, weakSource: string) => {
  logger.error(true, 'APP', `Fail to delete di`, `source: ${weakSource} di: ${uniqueId}`);
};

const CONNECT_TO_ENTITY = (id: string, uniqueId: string) => {
  logger.info(true, 'APP', 'Entity connected to DI', `${id} connect to ${uniqueId}`, {
    id,
    uniqueId: uniqueId,
  });
};

const FAIL_TO_CONNECT_TO_ENTITY = (uniqueId: string, id: string) => {
  logger.error(true, 'APP', 'Entity failed to connect to DI', `entity: ${id}, di: ${uniqueId}`, {
    id,
    uniqueId: uniqueId,
  });
};

const DISCONNECTED_FROM_ENTITY = (uniqueId: string, entityId: string) => {
  logger.info(true, 'APP', 'Disconnect DI', `DI: ${uniqueId} disconnected from entity ${entityId}`);
};

const DELETE = (uniqueId: string) => logger.info(true, 'APP', 'Delete DI', `DI with uniqueId ${uniqueId} deleted`);

export default {
  CREATED,
  FAIL_TO_CREATE,
  UPDATED,
  FAIL_TO_UPDATE,
  ALREADY_UP_TO_DATE,
  HASNT_ENTITY,
  ALREADY_CONNECTED,
  FAIL_TO_DISCONNECT,
  FAIL_TO_DELETE,
  CONNECT_TO_ENTITY,
  FAIL_TO_CONNECT_TO_ENTITY,
  DISCONNECTED_FROM_ENTITY,
  DELETE,
};
