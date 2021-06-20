import { ogApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { og } from '../../types/rgbType';

/**
 * Create kartoffel og from given og
 * @param og the got from rgb object
 * @returns object id from kartoffel
 */
export const insertOG = async (og: og) => {
  let krtflOg: og = await ogApi.get(og.hierarchy);

  if (!krtflOg) {
    if (hasFatherGroup(og)) {
      const fatherOg = createFatherGroup(og);
      await insertOG(fatherOg);
    }

    console.log('OG created', og.hierarchy);
    krtflOg = await ogApi.create(og);

    logInfo('OG created', krtflOg.id);
  }

  return krtflOg.id;
};

function createFatherGroup(og: og) {
  const fatherHierarchy = og.hierarchy.slice(0, og.hierarchy.lastIndexOf('/'));

  let fatherOg = Object.assign({}, og);
  fatherOg.hierarchy = fatherHierarchy;
  fatherOg.name = og.hierarchy.slice(og.hierarchy.lastIndexOf('/') + 1);

  return fatherOg;
}

function hasFatherGroup(og: og) {
  return og.hierarchy == '' ? false : true;
}

// if need to update to OG
//
// import { diff } from '../../util/utils';
//
//  else {
//   const ogDiff = diff(og, krtflOg);

//   if (Object.keys(krtflOg).length === 0) {
//     await ogApi.update(krtflOg.id, ogDiff);
//     logInfo('OG was updated', krtflOg.id);
//   } else {
//     logInfo('Nothing to update', krtflOg.id);
//   }
// }
