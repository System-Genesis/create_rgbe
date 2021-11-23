logger.info(false, 'Entity created', 'APP', `${fullName} created`, { id: entityIdentifier });
logger.error(false, 'Entity not Created', 'APP', `${fullName} not created`, { id: entityIdentifier });
logger.info(false, 'Entity updated', 'APP', `${fullName} updated`, { id: entityIdentifier, update: diffEntity }); //Object.keys
logger.error(false, 'Unknown Error', 'SYSTEM', `RGB Queue: ${erMsg}`);
logger.error(false, 'Unknown Error', 'SYSTEM', `ENTITY Queue: ${erMsg}`);
logger.info(false, 'Entity connected to DI', 'APP', `${entityIdentifier} connect to ${diId}`, {
  entity: entityIdentifier,
  di: diId,
}); // entity to id
logger.info(false, 'DI created', 'APP', `${krtflDI.uniqueId} created`, { uniqueId: krtflDI.uniqueId });
logger.error(false, 'DI not created', 'APP', `${di.uniqueId} not created`, { uniqueId: di.uniqueId });
logger.info(false, 'DI updated', 'APP', `updated: ${Object.keys(diDiff)}`, {
  uniqueId: krtflDI.uniqueId,
  updated: diDiff,
}); // add uniqueId
logger.info(false, 'Role created', 'APP', `${krtflRole.roleId} created`, { id: krtflRole.roleId });
logger.error(false, 'Role created', 'APP', `${krtflRole.roleId} not created`, { id: krtflRole.roleId }); // not
logger.info(false, 'Role updated', 'APP', `updated: ${Object.keys(diffRole)}`, {
  id: krtflRole.roleId,
  update: diffRole,
});
logger.info(false, 'Role moved to Group', 'APP', moveMsg, { id: krtflRole.roleId });
logger.error(false, 'Role fail to Group ', 'APP', moveMsg, { id: krtflRole.roleId, error }); // fail to move
logger.info(false, 'Role moved to DI', 'APP', moveMsg, { id: krtflRole.roleId });
logger.error(false, 'Role fail to DI ', 'APP', moveMsg, { id: krtflRole.roleId, error }); // fail to move
