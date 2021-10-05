import { diApi } from "../../api/rgb";
import { logInfo, logWarn } from "../../logger/logger";
import { di } from "../../types/rgbType";
import { diff } from "../../util/utils";
import { entityApi } from "./../../api/entity";

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

    //TODO fix response
    if (krtflDI) krtflDI = { ...di };

    logInfo("DI created", krtflDI.uniqueId);
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(diDiff).length > 0) {
      await diApi.update(krtflDI.uniqueId, diDiff);
      logInfo("DI was updated", krtflDI.uniqueId);
    } else {
      logInfo("Nothing to update", krtflDI.uniqueId);
    }
  }

  if (entityIdentifier) {
    await connectDiToEntity(krtflDI, entityIdentifier);
  } else {
    logWarn(`No entity to connect`, krtflDI.uniqueId);
  }

  return krtflDI.uniqueId || di.uniqueId;
};

/**
 * Connect di and entity (send to queue)
 * @param krtflDI di from kartoffel to connect to
 * @param entityIdentifier entity to connect by identifier (goalUserId/identityCard/personalNumber)
 */
async function connectDiToEntity(krtflDI: di, entityIdentifier: string) {
  let needConnection = true;

  if (krtflDI.entityId) {
    const getEnt = await entityApi.get(entityIdentifier);
    const connectedEntityId = getEnt.id || getEnt["_id"];

    if (connectedEntityId === krtflDI.entityId) {
      needConnection = false;
      logInfo(
        `DI already connected di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`
      );
    } else {
      logInfo(
        `DI moved, di: ${krtflDI.uniqueId} => entity: ${entityIdentifier}`
      );
    }
  }

  if (needConnection) {
    await diApi.connectToEntity(entityIdentifier, krtflDI.uniqueId);
  }
}
