import { create, get, update, connect } from '../../axios/rgb';
import { diff } from '../../util/utils';

export const insertRole = async (role: { _id: string }, ogId: string, diId: string) => {
  let targetGroup: string | undefined;
  let di: string | undefined;

  const krtflRole = await get.role(role._id);

  if (!krtflRole) {
    role['targetGroup'] = ogId;
    role['di'] = diId;

    create.og(role);
  } else {
    const diffROle = diff(role, krtflRole);

    if (diffROle.targetGroup) {
      targetGroup = diffROle.targetGroup;
      delete diffROle.targetGroup;
    }

    if (diffROle.di) {
      di = diffROle.di;
      delete diffROle.di;
    }

    const updatedRole = await update.og(role);

    if (di && di !== diId) connect.di(updatedRole._id, diId);
    if (targetGroup && targetGroup !== ogId) connect.og(updatedRole._id, ogId);
  }
  return role;
};
