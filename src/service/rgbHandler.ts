import { insertOG } from './insertOG';
import { insertRole } from './insertRole';
import { insertDI } from './insertDI';

type rgb = {
  og: object;
  di: object;
  role: object;
};

export const createRgb = async (obj: rgb) => {
  const og = await insertOG(obj.og);
  const di = await insertDI(obj.di);

  await insertRole(obj.role, og._id, di._id);
};
