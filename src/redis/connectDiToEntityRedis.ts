import logger from 'logger-genesis';
import { entityApi } from '../api/entity';
import { connectDiToEntityApi, disconnectDiToEntityApi } from '../api/rgb';
import { di } from '../types/rgbType';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

export const connectDiToEntity = async (entityIdentifier: string, di: di) => {
  const entity = await entityApi.get(entityIdentifier);

  if (entity) {
    if (di.entityId) {
      if (await disconnectDiToEntityApi(entity.id, di.uniqueId)) {
        logger.logInfo(
          false,
          'Entity disconnected from DI',
          'APP',
          `${entityIdentifier} disconnect from ${di.uniqueId}`,
          {
            id: entityIdentifier,
            uniqueId: di.uniqueId,
          }
        );
      } else {
        return logger.logError(
          false,
          'Entity fail to disconnected from DI',
          'APP',
          `${entityIdentifier}  fail disconnect from ${di.uniqueId}`,
          {
            id: entityIdentifier,
            uniqueId: di.uniqueId,
          }
        );
      }
    }
    await connectDiToEntityApi(entity.id, di.uniqueId);
    logger.logInfo(false, 'Entity connected to DI', 'APP', `${entityIdentifier} connect to ${di.uniqueId}`, {
      id: entityIdentifier,
      uniqueId: di.uniqueId,
    });
  } else {
    pushToArray(entityIdentifier, di.uniqueId);
  }
};

export const handleEntityEvent = async (entityIdentifier: string, entId: string) => {
  const data = await getArray(entityIdentifier);

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await connectDiToEntityApi(entId, data[i]);
      logger.logInfo(false, 'Entity connected to DI', 'APP', `${entityIdentifier} connect to ${data[i]}`, {
        id: entId,
        uniqueId: data[i],
      });
    }
  }

  delValue(entityIdentifier);
};

export const runAll = async () => {
  const keys = await getAllKeys();

  for (let i = 0; i < keys.length; i++) {
    const entityIdentifier = keys[i];
    const ent = await entityApi.get(entityIdentifier);
    if (ent) {
      handleEntityEvent(entityIdentifier, ent.id || ent['_id']);
    }
  }
};
