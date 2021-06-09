import { createEntity, getEntity, updateEntity } from '../../axios/entity';
import { logInfo } from '../../logger/logger';
import { entity } from '../../types/entityType';
import { diff } from '../../util/utils';

export const insertEntity = async (entity: entity) => {
  // add gu id
  const krtflEntity: entity = await getEntity(entity.personalNumber || entity.identityCard || '');

  if (!krtflEntity) {
    await createEntity(entity);
  } else {
    const diffEntity = diff(entity, krtflEntity);
    await updateEntity(diffEntity);
  }

  logInfo('Inserted entity successfully');
};
