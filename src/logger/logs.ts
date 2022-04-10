import diLog from './logs/di.log';
import entityLog from './logs/entity.log';
import globalLog from './logs/global.log';
import mirLog from './logs/mir.log';
import ogLog from './logs/og.log';
import rabbitLog from './logs/rabbit.log';
import roleLog from './logs/role.log';

export default {
  ...globalLog,
  RABBIT: rabbitLog,
  ENTITY: entityLog,
  MIR: mirLog,
  DI: diLog,
  OG: ogLog,
  ROLE: roleLog,
};
