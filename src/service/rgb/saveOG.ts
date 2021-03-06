import { ogApi } from '../../api/og';
import logs from '../../logger/logs';
import { og } from '../../types/rgbType';

/**
 * Create kartoffel og from given og
 * @param og the got from rgb object
 * @returns object id from kartoffel
 */
export const insertOG = async (og: og) => {
  let krtflOg: og = await ogApi.getByHierarchy(og.hierarchy ? og.hierarchy + '/' + og.name : og.name);

  if (!krtflOg) {
    if (hasFatherGroup(og)) {
      const fatherOg = createFatherGroup(og);
      const krtflOgId = await insertOG(fatherOg);

      og.directGroup = krtflOgId;
    }

    krtflOg = await ogApi.create(og);

    if (krtflOg) logs.OG.CREATE(og.hierarchy, og.name, krtflOg.id);
    else throw logs.OG.FAIL_TO_CREATE(og.hierarchy, og.name);
  }

  return krtflOg.id;
};

function createFatherGroup(og: og) {
  const fatherHierarchy = og.hierarchy.includes('/') ? og.hierarchy.slice(0, og.hierarchy.lastIndexOf('/')) : '';

  let fatherOg = { ...og };
  fatherOg.hierarchy = fatherHierarchy;
  fatherOg.name = og.hierarchy.slice(og.hierarchy.lastIndexOf('/') + 1);

  return fatherOg;
}

function hasFatherGroup(og: og) {
  return !(og.hierarchy == '');
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
