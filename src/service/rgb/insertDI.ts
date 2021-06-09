import { di as diApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertDI = async (di: { _id: string }) => {
  let krtflDI = await diApi.get(di._id);

  if (!krtflDI) {
    krtflDI = (await diApi.create(di))._id;
    logInfo('DI created', krtflDI);
  } else {
    const diDiff = diff(di, krtflDI);

    (await diApi.update(di._id, diDiff))._id;
    logInfo('DI was updated', krtflDI);
  }

  logInfo(`Send to connectQueue: DI => ${krtflDI._id} to Entity ${krtflDI['entityId']}`);
  await diApi.connectToEntity(krtflDI._id, krtflDI['entityId']);

  return krtflDI;
};
