import logger from 'logger-genesis';

const CREATE = (roleId: string) => {
  logger.info(true, 'APP', 'Role created', `roleId: ${roleId} created`, { roleId: roleId });
};

const FAIL_TO_CREATE = (roleId: string) => {
  logger.error(true, 'APP', 'Role not created', `roleId: ${roleId} not created`, {
    roleId: roleId,
  });
};

const UPDATE = (roleId: string, diffRole: object) => {
  const msgLog = `roleId: ${roleId} updated: ${Object.keys(diffRole)}`;
  logger.info(true, 'APP', 'Role updated', msgLog, {
    roleId: roleId,
    update: diffRole,
  });
};

const FAIL_TO_UPDATE = (roleId: string, diffRole: object) => {
  const msgLog = `roleId: ${roleId} updated: ${Object.keys(diffRole)}`;
  logger.warn(true, 'APP', 'Role fail to updated', msgLog, {
    roleId: roleId,
    update: diffRole,
  });
};

const ALREADY_UP_TO_DATE = (roleId: string) => {
  logger.info(true, 'APP', 'Role already up to date', `roleId: ${roleId}`, { roleId: roleId });
};

const CONNECT_TO_OG = (roleId: string, ogId: string) => {
  const moveMsg = `Role: ${roleId}, Group: ${ogId}`;

  logger.info(true, 'APP', 'Role connect to Group', moveMsg, { id: roleId });
};
const FAIL_TO_CONNECT_TO_OG = (roleId: string, ogId: string, error: any) => {
  const moveMsg = `Role: ${roleId}, Group: ${ogId}`;

  logger.error(true, 'APP', 'Role fail to connect to Group ', moveMsg, { id: roleId, error });
};
const CONNECT_TO_DI = (roleId: string, diId: string) => {
  const moveMsg = `Role: ${roleId}, DI: ${diId}`;
  logger.info(true, 'APP', 'Role connect to DI', moveMsg, { roleId: roleId });
};
const FAIL_TO_CONNECT_TO_DI = (roleId: string, diId: string, error: any) => {
  const moveMsg = `Role: ${roleId}, DI: ${diId}`;
  logger.error(true, 'APP', 'Role fail to connect to DI ', moveMsg, { roleId: roleId, error });
};
const DISCONNECT_FROM_DI = (roleId: string, uniqueId: string) => {
  logger.info(true, 'APP', 'Disconnect Role', `Role: ${roleId} disconnected from DI ${uniqueId}`);
};

const DELETE = (roleId: string) => logger.info(true, 'APP', 'Delete Role', `Role with roleId ${roleId} deleted`);

export default {
  CREATE,
  FAIL_TO_CREATE,
  UPDATE,
  FAIL_TO_UPDATE,
  ALREADY_UP_TO_DATE,
  CONNECT_TO_OG,
  FAIL_TO_CONNECT_TO_OG,
  CONNECT_TO_DI,
  FAIL_TO_CONNECT_TO_DI,
  DISCONNECT_FROM_DI,
  DELETE,
};
