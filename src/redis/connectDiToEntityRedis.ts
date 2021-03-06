import { entityApi } from '../api/entity';
import { connectDiToEntityApi, disconnectDiToEntityApi } from '../api/di';
import { di } from '../types/rgbType';
import { pushToArray, getArray, getAllKeys, delValue } from './redis';
import logs from '../logger/logs';

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
    logs.DI.DISCONNECTED_FROM_ENTITY(di.uniqueId, entityIdentifier);
  } else {
    throw logs.DI.FAIL_TO_DISCONNECT(entityIdentifier, di.source, di.uniqueId);
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
    logs.DI.CONNECT_TO_ENTITY(diUniqueId, entityIdentifier);
  } else {
    logs.DI.FAIL_TO_CONNECT_TO_ENTITY(diUniqueId, entityIdentifier);
  }
}

/**
 * Entity event when new entity created check if there is di that waiting to be connected
 *
 * @param entityIdentifier to find in redis all di that waiting to connect
 * @param entId to connect to
 */
export const handleEntityEvent = async (entityIdentifier: string, entId: string) => {
  const disUniqueId: string[] = await getArray(entityIdentifier);
  if (disUniqueId.length > 0) {
    for (let i = 0; i < disUniqueId.length; i++) {
      await handleConnectDiToEntity(entId, disUniqueId[i], entityIdentifier);
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
