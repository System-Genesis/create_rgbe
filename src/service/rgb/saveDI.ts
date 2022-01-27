import logger from 'logger-genesis';
import { diApi, disconnectDiToEntityApi } from '../../api/rgb';
import config from '../../config/env.config';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from './../../api/entity';

/**
 * Check if old di is need to be removed because the new di is stronger source
 *
 * @param uniqueId di uniqueId to find the di in kartoffel
 * @param source of new di to check if the existing di need to be replaced by new di (deleted and create new)
 * @returns the di that exists and need update or null for create new di (not exist or deleted)
 */
export const getDi = async (uniqueId: string, source: string) => {
  const di = await diApi.get(uniqueId);
  if (!di) return null;

  if (source === config.strongSource && di.source === config.weakSource) {
    // disconnect di from his entity before delete the di
    const krtflDi: di = await diApi.get(di.uniqueId);
    if (krtflDi.entityId) {
      if (!(await disconnectDiToEntityApi(krtflDi.uniqueId, krtflDi.entityId))) {
        const errTitle = `Fail to disconnect di from ${config.weakSource}`;
        logger.error(true, 'APP', errTitle, `di: ${krtflDi.uniqueId} entity: ${krtflDi.entityId}`);
        throw `Fail delete di because fail to disconnect di from ${config.weakSource}`;
      }
    }

    if (await diApi.delete(di.uniqueId)) {
      return null;
    } else {
      logger.error(true, 'APP', `Fail to delete di from ${config.weakSource}`, di.uniqueId);
      throw `Fail to delete di from ${config.weakSource}`;
    }
  }
  return di;
};

/**
 * Create/update(the fields with changes) from given di to kartoffel
 * And connect to his entity by id of DI end entity
 * @param di the got from rgb object
 * @returns objectId of kartoffel DI
 */
export const insertDI = async (di: di) => {
  const entityIdentifier = di.entityId;
  try {
    let krtflDI: di | null = await getDi(di.uniqueId, di.source);

    // create/update DI without entity connected (connect later)
    delete di.entityId;

    if (!krtflDI) {
      krtflDI = await diApi.create(di);
      if (krtflDI) {
        //TODO fix response
        if (krtflDI) krtflDI = { ...di };

        logger.info(false, 'APP', 'DI created', `${krtflDI.uniqueId} created`, {
          uniqueId: krtflDI.uniqueId,
        });
      } else {
        logger.error(false, 'APP', 'DI not created', `${di.uniqueId} not created`, {
          uniqueId: di.uniqueId,
        });
        return;
      }
    } else {
      const diDiff = diff(di, krtflDI);

      if (Object.keys(diDiff).length > 0) {
        const updated = await diApi.update(krtflDI.uniqueId, diDiff);

        const msgLog = `uniqueId: ${krtflDI.uniqueId}, updated: ${Object.keys(diDiff)}`;
        const extraFieldsLog = { uniqueId: krtflDI.uniqueId, updated: diDiff };
        if (updated) {
          logger.info(false, 'APP', 'DI updated', msgLog, extraFieldsLog);
        } else {
          logger.warn(false, 'APP', 'DI fail to updated', msgLog, extraFieldsLog);
        }
      } else {
        logger.warn(true, 'APP', 'DI already up to date', `uniqueId: ${krtflDI.uniqueId}`, {
          uniqueId: krtflDI.uniqueId,
        });
      }
    }

    if (entityIdentifier) {
      await connectDiToEntity(krtflDI, entityIdentifier);
    } else {
      logger.warn(true, 'APP', 'No entity to connect', `uniqueId: ${krtflDI.uniqueId}`, {
        uniqueId: krtflDI.uniqueId,
      });
    }

    return krtflDI.uniqueId || di.uniqueId;
  } catch (error) {
    return null;
  }
};

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di from kartoffel to connect to
 * @param entityIdentifier entity to connect by identifier (goalUserId/identityCard/personalNumber)
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier: string) {
  if (krtflDI.entityId) {
    const getEnt = await entityApi.get(entityIdentifier);
    const connectedEntityId = getEnt.id;

    if (connectedEntityId === krtflDI.entityId) {
      const connectMsg = `di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`;
      return logger.info(true, 'APP', 'DI already connected', connectMsg);
    }
  }

  await diApi.connectToEntity(entityIdentifier, krtflDI);
}
