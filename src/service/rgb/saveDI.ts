import { diApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from './../../api/entity';

/**
 * Create/update(the fields with changes) from given di to kartoffel
 * And connect to his entity by id of di end entity
 * @param di the got from rgb object
 * @returns object id from kartoffel
 */
export const insertDI = async (di: di) => {
  const entityIdentifier = di.entityId;

  let krtflDI: di = await diApi.get(di.uniqueId);

  if (!krtflDI) {
    // create DI without entity connected (connect later)
    delete di.entityId;

    krtflDI = await diApi.create(di);
    logInfo('DI created', krtflDI.uniqueId);
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(diDiff).length > 0) {
      await diApi.update(krtflDI.uniqueId, diDiff);
      logInfo('DI was updated', krtflDI.uniqueId);
    } else {
      logInfo('Nothing to update', krtflDI.uniqueId);
    }
  }

  if (entityIdentifier) {
    await connectDiToEntity(krtflDI, entityIdentifier);
  } else {
    logInfo(`No entity to connect, DI => ${krtflDI.uniqueId}`);
  }

  return krtflDI.uniqueId;
};

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di to connect to
 * @param entityIdentifier entity to connect
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier: string) {
  let needConnection = true;

  if (krtflDI.entityId) {
    const connectedEntityId = (await entityApi.get(entityIdentifier)).id;

    if (connectedEntityId === krtflDI.entityId) {
      needConnection = false;
      logInfo(`DI already connected di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`);
    }
  }

  if (needConnection) {
    await diApi.connectToEntity(krtflDI.uniqueId, entityIdentifier);
  }
}
