import { entityApi } from '../../api/entity';
import logs from '../../logger/logs';

import { handleEntityEvent } from '../../redis/connectDiToEntityRedis';
import { entity, krtflEntity } from '../../types/entityType';
import { diff, getIdentifier } from '../../util/utils';

/**
 * Create/update (only fields that change) entity from buildEntity queue to kartoffel
 * @param entity - from buildEntity queue
 */
export const insertEntity = async (entity: entity) => {
  const entityIdentifier = getIdentifier(entity);
  const fullName = `${entity.firstName} ${entity.lastName || ''}`;
  let entityToUpdate = await entityApi.getExistsEntity(entity);

  if (!entityToUpdate) {
    const createdEntity = await entityApi.create(entity);
    if (createdEntity) {
      logs.ENTITY.CREATED(fullName, entityIdentifier);

      handleEntityEvent(entityIdentifier, (createdEntity as krtflEntity).id || createdEntity['_id']);
    } else {
      logs.ENTITY.FAIL_TO_CREATE(fullName, entityIdentifier);
    }
  } else {
    const oldEntity = { ...entityToUpdate };

    // not need because we compare with mirror and not with kartoffel
    // if (oldEntity.pictures) diffPicture(entity, oldEntity);

    const diffEntity = diff(entity, oldEntity);

    if (Object.keys(diffEntity).length == 0) {
      logs.ENTITY.NOTHING_TO_UPDATE(fullName, getIdentifier(entityToUpdate));
    } else {
      const updated = await entityApi.update(getIdentifier(entityToUpdate), diffEntity);

      updated
        ? logs.ENTITY.UPDATE(fullName, entityIdentifier, diffEntity)
        : logs.ENTITY.FAIL_TO_UPDATE(fullName, entityIdentifier, diffEntity);
    }
  }
};
