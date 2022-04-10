import logger from 'logger-genesis';

const HAS_ENTITY = (uniqueId: string, entityId: string) => {
  logger.info(true, 'APP', 'Mir has entity to connect', `di.uniqueId: ${uniqueId} to entity identifiers: ${entityId}`);
};

const HASNT_ENTITY = (uniqueId: string) => {
  logger.warn(true, 'APP', 'Mir does not have entity to connect', `di:${uniqueId}`, {
    di: uniqueId,
  });
};
const WITHOUT_IDENTIFIERS = (uniqueId: string) => {
  logger.error(true, 'APP', 'Mir object without any identifiers', `di:${uniqueId}`, { di: uniqueId });
};

export default { HAS_ENTITY, HASNT_ENTITY, WITHOUT_IDENTIFIERS };
