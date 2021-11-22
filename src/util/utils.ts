import { entity } from '../types/entityType';

/**
 * Check the which fields has change
 * @param newObj obj to compare from
 * @param krtObj obj to compare to
 * @returns new obj with the fields that changed
 */
export function diff<T>(newObj: T, krtObj: T): T {
  const diffObj: T = {} as T;

  Object.keys(newObj).forEach((k) => {
    if (Array.isArray(newObj[k])) {
      for (let i = 0; i < newObj[k].length; i++) {
        const element = newObj[k][i];
        if (!krtObj[k].includes(element)) {
          diffObj[k] = newObj[k];
          break;
        }
      }
    } else if (newObj[k] instanceof Object && krtObj) {
      diffObj[k] = diff(newObj[k], krtObj[k]);

      if (Object.keys(diffObj[k]).length === 0) delete diffObj[k];
      else diffObj[k] = newObj[k];
    } else if (!krtObj || newObj[k] != krtObj[k]) diffObj[k] = newObj[k];
  });

  return diffObj;
}

/**
 * diff of pictures only by updateAt
 */
export const diffPicture = (newEntity: entity, oldEntity: entity) => {
  const oldPic = oldEntity.pictures;
  const newPic = newEntity.pictures;

  delete newEntity.pictures;
  delete oldEntity.pictures;

  if (
    oldPic?.profile?.meta?.updateAt &&
    (!oldPic?.profile?.meta?.updateAt ||
      newPic?.profile?.meta?.updateAt != oldPic?.profile?.meta?.updateAt)
  ) {
    oldEntity.pictures = { profile: newPic?.profile };
  }
  if (
    oldPic?.avatar?.meta?.updateAt &&
    (!oldPic?.avatar?.meta?.updateAt ||
      newPic?.avatar?.meta?.updateAt != oldPic?.avatar?.meta?.updateAt)
  ) {
    oldEntity.pictures = { avatar: newPic?.avatar, ...oldEntity.pictures };
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
