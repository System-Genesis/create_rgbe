import logger from 'logger-genesis';
import { entity } from '../../types/entityType';

const CREATED = (fullName: string, entityIdentifier: string) => {
  logger.info(true, 'APP', 'Entity created', `${fullName} created`, { id: entityIdentifier });
};

const FAIL_TO_CREATE = (fullName: string, entityIdentifier: string) => {
  logger.error(true, 'APP', 'Entity not Created', `${fullName} not created`, { id: entityIdentifier });
};

const UPDATE = (fullName: string, entityIdentifier: string, diffEntity: entity) => {
  logger.info(true, 'APP', 'Entity updated', `${fullName} updated, ${Object.keys(diffEntity)}`, {
    id: entityIdentifier,
    update: diffEntity,
  });
};

const FAIL_TO_UPDATE = (fullName: string, entityIdentifier: string, diffEntity: entity) => {
  logger.warn(true, 'APP', 'Entity fail to updated', `${fullName} updated, ${Object.keys(diffEntity)}`, {
    id: entityIdentifier,
    update: diffEntity,
  });
};

const NOTHING_TO_UPDATE = (fullName: string, entityIdentifier: string) => {
  logger.info(true, 'APP', 'Nothing to update', `${fullName} nothing to update`, {
    identifier: entityIdentifier,
  });
};

export default { CREATED, FAIL_TO_CREATE, UPDATE, FAIL_TO_UPDATE, NOTHING_TO_UPDATE };
