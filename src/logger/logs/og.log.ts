import logger from 'logger-genesis';

const CREATE = (hierarchy: string, name: string, id: string) => {
  logger.info(true, 'APP', 'Group created', `${hierarchy + '/' + name} created`, { id });
};

const FAIL_TO_CREATE = (hierarchy: string, name: string) => {
  logger.error(true, 'APP', 'Group not created', `${hierarchy + '/' + name} not created`, {
    identifier: hierarchy + '/' + name,
  });
};

export default { CREATE, FAIL_TO_CREATE };
