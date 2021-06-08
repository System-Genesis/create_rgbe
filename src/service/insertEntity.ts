import { createEntity, getEntity, updateEntity } from '../axios/entity';
import { entity } from '../types/entityType';

export const insertEntity = async (entity: entity) => {
  // add gu id
  const krtflEntity = getEntity(entity.personalNumber || entity.identityCard || '');

  // await to check if success or continue to run
  if (!krtflEntity) {
    createEntity(entity);
  } else {
    const diffEntity = diff(entity, krtflEntity);
    updateEntity(diffEntity);
  }
};

function diff(obj: object, other: object) {
  return Object.assign(obj, other);
}
