import { menash } from 'menashmq';
import path from 'path';
import winston, { config, format } from 'winston';
import configEnv from '../config/env.config';

const date = () => new Date(Date.now()).toLocaleDateString().replace(/\//g, '_');

export const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(
    format.colorize(),
    // format.timestamp({
    //   format: 'YYYY-MM-DD HH:mm:ss',
    // }),
    format.splat(),
    format.simple()
    // format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, `../../log/${date()}-logger.log`),
      maxsize: 50000,
    }),
  ],
});

/**
 * Send log in level INFO to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logInfo = (msg: string, any?: any) => {
  logs('info', msg, any);
};

/**
 * Send log in level warn to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logWarn = (msg: string, any?: any) => {
  logs('warn', msg, any);
};

/**
 * Send log in level ERROR to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logError = (msg: string, any?: any) => {
  logs('error', msg, any);
};

export const logs = (level: string, msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level,
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'traking',
    service: 'CREATE RGBE',
    extraFields: any,
  });

  logger[level](`${msg} ${!any ? '' : JSON.stringify(any)}`);
};
