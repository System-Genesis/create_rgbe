import { insertOG } from './insertOG';
import { insertRole } from './insertRole';
import { insertDI } from './insertDI';
import { logInfo } from '../../logger/logger';
import { rgb } from '../../types/entityType';

export const createRgb = async (obj: rgb) => {
  const og = await insertOG(obj.og);
  logInfo('OG created');
  const di = await insertDI(obj.di);
  logInfo('DI created');

  await insertRole(obj.role, og._id, di._id);
  logInfo('Role created');
};
