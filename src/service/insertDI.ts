import { create, get, update } from '../axios/rgb';

export const insertDI = async (di) => {
  const krtflDI = await get.og(di.id);

  if (!krtflDI) {
    create.di(di);
  } else {
    // diff
    update.di(di);
  }

  // connect entity to DI
  return di;
};
