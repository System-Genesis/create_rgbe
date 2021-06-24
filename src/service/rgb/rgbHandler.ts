import { insertOG } from './saveOG';
import { insertRole } from './saveRole';
import { insertDI } from './saveDI';
import { rgb } from '../../types/rgbType';

/**
 * Handler to creat/update roll-OG-DI by specific order to get the needed information between objects
 * @param rgbObj {og:{...},role:{...},di:{...}} get from buildRGB queue
 */
export const createRgb = async (rgbObj: rgb) => {
  const diId = await insertDI(rgbObj.di);

  if (rgbObj.og && rgbObj.role) {
    const ogId = await insertOG(rgbObj.og);

    await insertRole(rgbObj.role, ogId, diId);
  }
};
