import { diApi, disconnectDiToEntityApi } from '../../api/di';
import config from '../../config/env.config';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from '../../api/entity';
import logs from '../../logger/logs';

/**
 * Create/update(the fields with changes) from given di to kartoffel
 * And connect to his entity by id of DI end entity
 * @param di the got from rgb object
 * @returns objectId of kartoffel DI
 */
export const handleDi = async (di: di) => {
  const entityIdentifier = di.entityId;
  try {
    const krtflDI = await insertDi(di);

    await connectDiToEntity(krtflDI, entityIdentifier);

    return krtflDI.uniqueId || di.uniqueId;
  } catch (error) {
    return null;
  }
};

async function insertDi(di: di) {
  let krtflDI: di | null = await getDi(di.uniqueId, di.source);

  // create/update DI without entity connected (connect later)
  delete di.entityId;

  if (!krtflDI) {
    if (await diApi.create(di)) {
      logs.DI.CREATED(di.uniqueId);
    } else {
      throw logs.DI.FAIL_TO_CREATE(di.uniqueId);
    }
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(diDiff).length == 0) {
      logs.DI.ALREADY_UP_TO_DATE(krtflDI.uniqueId);
    } else {
      const updated = await diApi.update(krtflDI.uniqueId, diDiff);

      updated ? logs.DI.UPDATED(krtflDI.uniqueId, diDiff) : logs.DI.FAIL_TO_UPDATE(krtflDI.uniqueId, diDiff);
    }
  }

  return krtflDI || di;
}

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di from kartoffel to connect to
 * @param entityIdentifier entity to connect by identifier (goalUserId/identityCard/personalNumber)
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier?: string) {
  if (!entityIdentifier) return logs.DI.HASNT_ENTITY(krtflDI.uniqueId);

  if (krtflDI.entityId) {
    const connectedEntityId: string | null = await entityApi.getId(entityIdentifier);

    if (connectedEntityId && connectedEntityId === krtflDI.entityId) {
      return logs.DI.ALREADY_CONNECTED(krtflDI.uniqueId, entityIdentifier);
    }
  }

  await diApi.connectToEntity(entityIdentifier, krtflDI);
}

/**
 * Check if old di is need to be removed because the new di is stronger source
 *
 * @param uniqueId di uniqueId to find the di in kartoffel
 * @param source of new di to check if the existing di need to be replaced by new di (deleted and create new)
 * @returns the di that exists and need update or null for create new di (not exist or deleted)
 */
export async function getDi(uniqueId: string, source: string) {
  const di = await diApi.get(uniqueId);
  if (!di) return null;

  if (source === config.strongSource && di.source === config.weakSource) {
    // disconnect di from his entity before delete the di
    const krtflDi: di = await diApi.get(di.uniqueId);
    if (krtflDi.entityId) {
      if (!(await disconnectDiToEntityApi(krtflDi.entityId, krtflDi.uniqueId))) {
        logs.DI.FAIL_TO_DISCONNECT(krtflDi.uniqueId, config.weakSource, krtflDi.entityId);
        throw `Fail delete di because fail to disconnect di from ${config.weakSource}`;
      }
    }

    if (await diApi.delete(di.uniqueId)) {
      // return null for create new di because di not existing anymore
      return null;
    } else {
      logs.DI.FAIL_TO_DELETE(krtflDi.uniqueId, config.weakSource);
      throw `Fail to delete di from ${config.weakSource}`;
    }
  }
  return di;
}
