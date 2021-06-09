import { og as ogApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertOG = async (og: { _id: string }) => {
  let krtflOg = await ogApi.get(og._id);

  if (!krtflOg) {
    krtflOg = (await ogApi.create(og))._id;

    logInfo('OG created', krtflOg);
  } else {
    const ogDiff = diff(og, krtflOg);

    (await ogApi.update(krtflOg._id, ogDiff))._id;

    logInfo('OG was updated', krtflOg);
  }

  return krtflOg._id;
};
