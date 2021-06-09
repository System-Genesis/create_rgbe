import { get, create, update } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertOG = async (og: { _id: string }) => {
  let krtflOg = await get.og(og._id);

  if (!krtflOg) {
    krtflOg = (await create.og(og))._id;

    logInfo('OG created', krtflOg);
  } else {
    const ogDiff = diff(og, krtflOg);

    (await update.og(ogDiff))._id;

    logInfo('OG was updated', krtflOg);
  }

  return krtflOg._id;
};
