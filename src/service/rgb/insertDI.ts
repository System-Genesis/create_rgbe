import { get, create, update } from '../../axios/rgb';
import { diff } from '../../util/utils';

export const insertDI = async (di: { _id: string }) => {
  const krtflDI = await get.di(di._id);

  if (!krtflDI) {
    return (await create.di(di))._id;
  } else {
    const diDiff = diff(di, krtflDI);

    return (await update.di(diDiff))._id;
  }
};
