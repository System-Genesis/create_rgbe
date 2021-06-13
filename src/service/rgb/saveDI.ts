import { diApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { di } from '../../types/rgbType';
import { diff } from '../../util/utils';
import { entityApi } from './../../api/entity';

export const insertDI = async (di: di) => {
  const entityId = di.entityId;

  let krtflDI: di = await diApi.get(di.uniqueId);

  if (!krtflDI) {
    // create DI without entity connected (connect later)
    delete di.entityId;

    krtflDI = await diApi.create(di);
    logInfo('DI created', krtflDI.uniqueId);
  } else {
    const diDiff = diff(di, krtflDI);

    if (Object.keys(krtflDI).length > 0) {
      await diApi.update(krtflDI.uniqueId, diDiff);
      logInfo('DI was updated', krtflDI);
    } else {
      logInfo('Nothing to update', krtflDI);
    }
  }

  if (entityId) {
    await connectDiToEntity(krtflDI, entityId);
  } else {
    logInfo(`No entity to connect, DI => ${krtflDI.uniqueId}`);
  }

  return krtflDI.uniqueId;
};

async function connectDiToEntity(krtflDI: di, entityId: string) {
  if (!krtflDI.entityId || (await entityApi.get(krtflDI.entityId)).id !== krtflDI.entityId) {
    logInfo(`Send to connectQueue: DI => ${krtflDI.uniqueId} to Entity ${entityId}`);
    await diApi.connectToEntity(krtflDI.uniqueId, entityId);
  } else {
    logInfo(`DI already connected ${krtflDI.uniqueId} => ${entityId}`);
  }
}
