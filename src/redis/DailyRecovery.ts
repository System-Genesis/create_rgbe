import schedule from 'node-schedule';
import config from '../config/env.config';
import { runAll } from './connectDiToEntityRedis';
import logger from 'logger-genesis';

const { hour: defHour, minute: defMinute } = config.daily;

export class RecoveryDiConnection {
  static instance: RecoveryDiConnection;

  public static getInstance(): RecoveryDiConnection {
    if (!RecoveryDiConnection.instance) {
      RecoveryDiConnection.instance = new RecoveryDiConnection();
    }
    return RecoveryDiConnection.instance;
  }

  hour: number;
  minute: number;
  runFunc: schedule.Job;

  private constructor(hour: number = defHour, minute: number = defMinute) {
    this.hour = hour;
    this.minute = minute;
  }

  public async start() {
    logger.logInfo(false, 'Daily run', 'APP', `Time: ${this.hour}:${this.minute}`);
    runAll();
    this.runFunc = schedule.scheduleJob({ hour: this.hour, minute: this.minute }, () => {
      logger.logInfo(false, 'Daily run', 'APP', `start Daily run`);
      runAll();
    });
  }

  public changeRunTime(hour: number, minute: number) {
    this.runFunc.cancel();
    this.hour = hour;
    this.minute = minute;
    this.start();
  }
}
