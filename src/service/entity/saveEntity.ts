import logger from 'logger-genesis';
import { entityApi } from '../../api/entity';

import { handleEntityEvent } from '../../redis/connectDiToEntityRedis';
import { entity } from '../../types/entityType';
import { diff, diffPicture } from '../../util/utils';

/**
 * Create/update (only fields that change) entity from buildEntity queue to kartoffel
 * @param entity - from buildEntity queue
 */
export const insertEntity = async (entity: entity) => {
  const entityIdentifier = entity.identityCard || entity.personalNumber || entity.goalUserId!;
  const fullName = `${entity.firstName} ${entity.lastName || ''}`;
  let krtflEntity = await getExistsEntity(entity);

  if (!krtflEntity) {
    krtflEntity = await entityApi.create(entity);
    if (krtflEntity) {
      logger.info(true, 'APP', 'Entity created', `${fullName} created`, { id: entityIdentifier });

      handleEntityEvent(entityIdentifier, krtflEntity.id || krtflEntity['_id']);
    } else {
      logger.error(true, 'APP', 'Entity not Created', `${fullName} not created`, { id: entityIdentifier });
    }
  } else {
    const oldEntity = { ...krtflEntity };
    if (oldEntity.pictures) diffPicture(entity, oldEntity);

    const diffEntity = diff(entity, oldEntity);

    if (Object.keys(diffEntity).length > 0) {
      const updated = await entityApi.update(krtflEntity.id || krtflEntity['_id'], diffEntity);
      if (updated) {
        logger.info(true, 'APP', 'Entity updated', `${fullName} updated, ${Object.keys(diffEntity)}`, {
          id: entityIdentifier,
          update: diffEntity,
        });
      } else {
        logger.warn(true, 'APP', 'Entity fail to updated', `${fullName} updated, ${Object.keys(diffEntity)}`, {
          id: entityIdentifier,
          update: diffEntity,
        });
      }
    } else {
      logger.info(true, 'APP', 'Nothing to update', `${fullName} nothing to update`, { id: krtflEntity.id });
    }
  }
};

/**
 * Search entity in kartofel by goalUserId or identityCard and/or personalNumber
 * If has identityCard but not found steel need to check by personalNumber
 * If there in so identityCard field than personalNumber must to exist
 * @param entity from queue
 * @returns kartofel entity / null
 */
export async function getExistsEntity(entity: entity) {
  if (entity.goalUserId) return await entityApi.get(entity.goalUserId);

  return (
    (await entityApi.get(entity.identityCard || entity.personalNumber!)) ||
    (await entityApi.get(entity.personalNumber!))
  );
}
