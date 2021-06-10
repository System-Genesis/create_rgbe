import { ogApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { og } from '../../types/rgbType';
import { diff } from '../../util/utils';

export const insertOG = async (og: og) => {
  // how send hierarchy with /
  let krtflOg = await ogApi.get(og.hierarchy);

  if (!krtflOg) {
    krtflOg = (await ogApi.create(og)).id;

    logInfo('OG created', krtflOg);
  } else {
    const ogDiff = diff(og, krtflOg);

    if (Object.keys(krtflOg).length === 0) {
      (await ogApi.update(krtflOg, ogDiff)).id;
      logInfo('OG was updated', krtflOg);
    } else {
      logInfo('Nothing to update', krtflOg);
    }
  }

  console.log(krtflOg);
  return krtflOg;
};
