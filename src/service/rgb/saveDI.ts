import logger from 'logger-genesis';
import { diApi } from '../../api/rgb';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from './../../api/entity';

/**
 * Create/update(the fields with changes) from given di to kartoffel
 * And connect to his entity by id of DI end entity
 * @param di the got from rgb object
 * @returns objectId of kartoffel DI
 */
export const insertDI = async (di: di) => {
  const entityIdentifier = di.entityId;
  let krtflDI: di = await diApi.get(di.uniqueId);

  // create/update DI without entity connected (connect later)
  delete di.entityId;

  if (!krtflDI) {
    krtflDI = await diApi.create(di);
    if (krtflDI) {
      //TODO fix response
      if (krtflDI) krtflDI = { ...di };

      logger.logInfo(false, 'DI created', 'APP', '', { uniqueId: krtflDI.uniqueId });
    } else {
      logger.logError(false, 'DI not created', 'APP', '', { uniqueId: di.uniqueId });
      return;
    }
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(diDiff).length > 0) {
      await diApi.update(krtflDI.uniqueId, diDiff);
      logger.logInfo(false, 'DI updated', 'APP', `updated: ${Object.keys(diDiff)}`, {
        uniqueId: krtflDI.uniqueId,
        updated: diDiff,
      });
    } else {
      logger.logWarn(true, 'DI already up to date', 'APP', '', { uniqueId: krtflDI.uniqueId });
    }
  }

  if (entityIdentifier) {
    await connectDiToEntity(krtflDI, entityIdentifier);
  } else {
    logger.logWarn(true, 'No entity to connect', 'APP', '', { uniqueId: krtflDI.uniqueId });
  }

  return krtflDI.uniqueId || di.uniqueId;
};

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di from kartoffel to connect to
 * @param entityIdentifier entity to connect by identifier (goalUserId/identityCard/personalNumber)
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier: string) {
  if (krtflDI.entityId) {
    const getEnt = await entityApi.get(entityIdentifier);
    const connectedEntityId = getEnt.id || getEnt['_id'];
    const connectMsg = `di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`;

    if (connectedEntityId === krtflDI.entityId) {
      return logger.logInfo(true, 'DI already connected', 'APP', connectMsg);
    }
  }

  await diApi.connectToEntity(entityIdentifier, krtflDI.uniqueId);
}
