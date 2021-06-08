import { get, create, update } from '../axios/rgb';

export const insertOG = async (og) => {
  const krtflOg = await get.og(og.id);

  if (!krtflOg) {
    create.og(og);
  } else {
    // diff
    update.og(og);
  }
  return og;
};
