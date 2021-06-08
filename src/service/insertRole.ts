import { create, get, update } from '../axios/rgb';

export const insertRole = async (role, ogId, diId) => {
  const krtflRole = await get.role(role.id);

  if (!krtflRole) {
    create.og(role);
  } else {
    // diff
    // cut targetGroup
    // cut DI
    update.og(role);
    // connect OG
    ogId;
    diId;
    // connect DI
  }
  return role;
};
