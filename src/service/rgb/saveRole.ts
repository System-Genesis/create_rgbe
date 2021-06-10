import { roleApi } from '../../api/rgb';
import { logInfo } from '../../logger/logger';
import { role } from '../../types/rgbType';
import { diff } from '../../util/utils';

export const insertRole = async (role: role, ogId: string, diId: string) => {
  let targetGroup: string | undefined;
  let di: string | undefined;

  let krtflRole = await roleApi.get(role.roleId);

  if (!krtflRole) {
    role['targetGroup'] = ogId;
    role['di'] = diId;

    krtflRole = await roleApi.create(role);
    logInfo('Role created', krtflRole);
  } else {
    const diffROle = diff(role, krtflRole);

    if (diffROle.targetGroup) {
      targetGroup = diffROle.targetGroup;
      if (targetGroup !== ogId) roleApi.connectToOG(krtflRole._id, ogId);
      delete diffROle.targetGroup;
    }

    if (diffROle.di) {
      di = diffROle.di;
      if (di !== diId) roleApi.connectToDI(krtflRole._id, diId);
      delete diffROle.di;
    }

    if (Object.keys(krtflRole).length === 0) {
      await roleApi.update(krtflRole._id, role);
      logInfo('Role was updated', krtflRole);
    } else {
      logInfo('Nothing to update', krtflRole);
    }
  }

  return krtflRole;
};
