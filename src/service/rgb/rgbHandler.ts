import { insertOG } from './insertOG';
import { insertRole } from './insertRole';
import { insertDI } from './insertDI';
import { rgb } from '../../types/rgbType';

export const createRgb = async (obj: rgb) => {
  const ogId = await insertOG(obj.og);

  const diId = await insertDI(obj.di);

  await insertRole(obj.role, ogId, diId);
};
