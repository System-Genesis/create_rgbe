// import { menash } from 'menashmq';
import path from 'path';
// import os from 'os';
import winston, { config, format } from 'winston';
// import configEnv from '../config/env.config';

const date = () => new Date(Date.now()).toLocaleDateString();

export const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(
    format.colorize(),
    // format.timestamp({
    //   format: 'YYYY-MM-DD HH:mm:ss',
    // }),
    format.splat(),
    format.simple(),
    // format((info) => {
    //   info.service = 'build entity';
    //   info.hostname = os.hostname();
    //   return info;
    // })(),
    format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, `../../log/${date()}-logger.log`),
      maxsize: 50000,
    }),
  ],
});

export const logInfo = (msg: string, any: any = '') => {
  // menash.send(configEnv.rabbit.logger, {
  //   level: 'info',
  //   message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
  //   system: 'traking',
  //   service: 'build entity',
  // });
  // if (any) logger.info(`${msg} ${JSON.stringify(any)}`);
  // else logger.info(msg);
  console.log(msg);
  console.log(any);
};

export const logError = (msg: string, any: any = '') => {
  // menash.send(configEnv.rabbit.logger, {
  //   level: 'error',
  //   message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
  //   system: 'traking',
  //   service: 'build entity',
  // });
  // logger.error(`${msg} ${!any ? '' : JSON.stringify(any)}`);
  logInfo(msg, any);
};
