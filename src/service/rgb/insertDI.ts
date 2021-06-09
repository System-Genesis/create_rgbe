import { get, create, update, connect } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertDI = async (di: { _id: string }) => {
  let krtflDI = await get.di(di._id);

  if (!krtflDI) {
    krtflDI = (await create.di(di))._id;
    logInfo('DI created', krtflDI);
  } else {
    const diDiff = diff(di, krtflDI);

    (await update.di(diDiff))._id;
    logInfo('DI was updated', krtflDI);
  }

  logInfo(`Send to connectQueue: DI => ${krtflDI._id} to Entity ${krtflDI['entityId']}`);
  await connect.diToEntity(krtflDI._id, krtflDI['entityId']);

  return krtflDI;
};
