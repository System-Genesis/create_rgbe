import logger from 'logger-genesis';
import { entityApi } from '../api/entity';
import { connectDiToEntityApi, disconnectDiToEntityApi } from '../api/di';
import { di } from '../types/rgbType';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';

/**
 * Disconnect di before connect to new di
 *
 * @param di to disconnect from the entity
 * @param entityIdentifier for logs to now entity identifier
 * @returns void al throw if disconnect failed
 */
const disconnectDi = async (di: di, entityIdentifier: string) => {
  if (!di.entityId) return;

  if (await disconnectDiToEntityApi(di.entityId, di.uniqueId)) {
    logger.info(true, 'APP', 'Entity disconnected from DI', `${entityIdentifier} disconnect from ${di.uniqueId}`, {
      id: entityIdentifier,
      uniqueId: di.uniqueId,
    });
  } else {
    throw logger.error(
      true,
      'APP',
      'Entity fail to disconnected from DI',
      `${entityIdentifier}  fail disconnect from ${di.uniqueId}`,
      {
        id: entityIdentifier,
        uniqueId: di.uniqueId,
      }
    );
  }
};

/**
 * Connect di to entity and cal disconnect if connected to another entity
 *
 * @param entityIdentifier to find entity to connect to
 * @param di to connect to
 */
export const connectDiToEntity = async (entityIdentifier: string, di: di) => {
  const entityId: string | null = await entityApi.getId(entityIdentifier);
  try {
    if (di.entityId) {
      await disconnectDi(di, entityIdentifier);
    }

    if (entityId) {
      await handleConnectDiToEntity(entityId, di.uniqueId, entityIdentifier);
    } else {
      pushToArray(entityIdentifier, di.uniqueId);
    }
  } catch (error) {
    console.log('disconnect failed');
  }
};

/**
 *
 * @param entityId to connect to
 * @param diUniqueId di to connect to the entity
 * @param entityIdentifier entity identifier for logs
 */
async function handleConnectDiToEntity(entityId: string, diUniqueId: string, entityIdentifier: string) {
  if (await connectDiToEntityApi(entityId, diUniqueId)) {
    logger.info(true, 'APP', 'Entity connected to DI', `${entityIdentifier} connect to ${diUniqueId}`, {
      id: entityIdentifier,
      uniqueId: diUniqueId,
    });
  } else {
    logger.error(true, 'APP', 'Entity failed to connect to DI', `entity: ${entityIdentifier}, di: ${diUniqueId}`, {
      id: entityIdentifier,
      uniqueId: diUniqueId,
    });
  }
}

/**
 * Entity event when new entity created check if there is di that waiting to be connected
 *
 * @param entityIdentifier to find in redis all di that waiting to connect
 * @param entId to connect to
 */
export const handleEntityEvent = async (entityIdentifier: string, entId: string) => {
  const data: string[] = await getArray(entityIdentifier);
  // TODO (N): data => uniqueIds
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      await handleConnectDiToEntity(entId, data[i], entityIdentifier);
    }
  }

  delValue(entityIdentifier);
};

/**
 * Recovery all waiting di's that waiting to connect,
 * Probably they waiting to connect because entity and di created in same tome
 *    so no event handle the connection
 */
export const runAll = async () => {
  const keys: string[] = await getAllKeys();

  for (let i = 0; i < keys.length; i++) {
    const entityIdentifier: string = keys[i];
    const entId: string | null = await entityApi.getId(entityIdentifier);
    if (entId) {
      handleEntityEvent(entityIdentifier, entId);
    }
  }
};
