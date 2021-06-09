import { get, create, update } from '../../axios/rgb';
import { diff } from '../../util/utils';

export const insertOG = async (og: { _id: string }) => {
  const krtflOg = await get.og(og._id);

  if (!krtflOg) {
    return (await create.og(og))._id;
  } else {
    const ogDiff = diff(og, krtflOg);

    return (await update.og(ogDiff))._id;
  }
};
