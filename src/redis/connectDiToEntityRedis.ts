import logger from 'logger-genesis';
import { entityApi } from '../api/entity';
import { connectDiToEntityApi, disconnectDiToEntityApi } from '../api/rgb';
import { di } from '../types/rgbType';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

const disconnectDi = async (di: di, entityIdentifier: string) => {
  if (!di.entityId) return;

  if (await disconnectDiToEntityApi(di.entityId, di.uniqueId)) {
    logger.info(false, 'APP', 'Entity disconnected from DI', `${entityIdentifier} disconnect from ${di.uniqueId}`, {
      id: entityIdentifier,
      uniqueId: di.uniqueId,
    });
  } else {
    throw logger.error(false, 'APP', 'Entity fail to disconnected from DI', `${entityIdentifier}  fail disconnect from ${di.uniqueId}`, {
      id: entityIdentifier,
      uniqueId: di.uniqueId,
    });
  }
};

export const connectDiToEntity = async (entityIdentifier: string, di: di) => {
  const entity = await entityApi.get(entityIdentifier);
  try {
    if (di.entityId) {
      await disconnectDi(di, entityIdentifier);
    }

    if (entity) {
      await connectDiToEntityApi(entity.id, di.uniqueId);
      logger.info(false, 'APP', 'Entity connected to DI', `${entityIdentifier} connect to ${di.uniqueId}`, {
        id: entityIdentifier,
        uniqueId: di.uniqueId,
      });
    } else {
      pushToArray(entityIdentifier, di.uniqueId);
    }
  } catch (error) {
    console.log('disconnect failed');
  }
};

export const handleEntityEvent = async (entityIdentifier: string, entId: string) => {
  const data = await getArray(entityIdentifier);

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await connectDiToEntityApi(entId, data[i]);
      logger.info(false, 'APP', 'Entity connected to DI', `${entityIdentifier} connect to ${data[i]}`, {
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
      handleEntityEvent(entityIdentifier, ent.id);
    }
  }
};
