import logger from 'logger-genesis';
import { diApi, disconnectDiToEntityApi } from '../../api/di';
import config from '../../config/env.config';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from '../../api/entity';

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
    krtflDI = await diApi.create(di);
    if (krtflDI) {
      logger.info(true, 'APP', 'DI created', `${krtflDI.uniqueId} created`, {
        uniqueId: krtflDI.uniqueId,
      });
    } else {
      throw logger.error(true, 'APP', 'DI not created', `${di.uniqueId} not created`, {
        uniqueId: di.uniqueId,
      });
    }
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(diDiff).length > 0) {
      const updated = await diApi.update(krtflDI.uniqueId, diDiff);

      const msgLog = `uniqueId: ${krtflDI.uniqueId}, updated: ${Object.keys(diDiff)}`;
      const extraFieldsLog = { uniqueId: krtflDI.uniqueId, updated: diDiff };
      if (updated) {
        logger.info(true, 'APP', 'DI updated', msgLog, extraFieldsLog);
      } else {
        logger.warn(true, 'APP', 'DI fail to updated', msgLog, extraFieldsLog);
      }
    } else {
      logger.warn(true, 'APP', 'DI already up to date', `uniqueId: ${krtflDI.uniqueId}`, {
        uniqueId: krtflDI.uniqueId,
      });
    }
  }

  return krtflDI;
}

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di from kartoffel to connect to
 * @param entityIdentifier entity to connect by identifier (goalUserId/identityCard/personalNumber)
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier?: string) {
  if (!entityIdentifier) {
    logger.warn(true, 'APP', 'No entity to connect', `uniqueId: ${krtflDI.uniqueId}`, {
      uniqueId: krtflDI.uniqueId,
    });
    return;
  }

  if (krtflDI.entityId) {
    const connectedEntityId: string | null = await entityApi.getId(entityIdentifier);

    if (connectedEntityId && connectedEntityId === krtflDI.entityId) {
      const connectMsg = `di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`;
      return logger.info(true, 'APP', 'DI already connected', connectMsg);
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
        const errTitle = `source: ${config.weakSource} di: ${krtflDi.uniqueId} entity: ${krtflDi.entityId}`;
        logger.error(true, 'APP', `Fail to disconnect di`, errTitle);
        throw `Fail delete di because fail to disconnect di from ${config.weakSource}`;
      }
    }

    if (await diApi.delete(di.uniqueId)) {
      return null;
    } else {
      logger.error(true, 'APP', `Fail to delete di`, `source: ${config.weakSource} di: di.uniqueId`);
      throw `Fail to delete di from ${config.weakSource}`;
    }
  }
  return di;
}
