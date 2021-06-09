import { create, get, update, connect } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { diff } from '../../util/utils';

export const insertRole = async (role: { _id: string }, ogId: string, diId: string) => {
  let targetGroup: string | undefined;
  let di: string | undefined;

  let krtflRole = await get.role(role._id);

  if (!krtflRole) {
    role['targetGroup'] = ogId;
    role['di'] = diId;

    krtflRole = await create.og(role);
    logInfo('Role created', krtflRole);
  } else {
    const diffROle = diff(role, krtflRole);

    if (diffROle.targetGroup) {
      targetGroup = diffROle.targetGroup;
      if (targetGroup !== ogId) connect.ogToRole(krtflRole._id, ogId);
      delete diffROle.targetGroup;
    }

    if (diffROle.di) {
      di = diffROle.di;
      if (di !== diId) connect.diToRole(krtflRole._id, diId);
      delete diffROle.di;
    }

    await update.og(role);
    logInfo('Role was updated', krtflRole);
  }

  return krtflRole;
};
