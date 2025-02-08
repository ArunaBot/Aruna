import { ILoggerOptions, Logger } from '@promisepending/logger.js';
import { ArunaCoreAPI } from 'arunabase';

export class DatabaseManager {
  private logger: Logger;
  private arunacore: ArunaCoreAPI.ArunaCoreClient;

  constructor(loggerOptions: ILoggerOptions, arunacore: ArunaCoreAPI.ArunaCoreClient) {
    this.logger = new Logger({ ...loggerOptions, prefix: 'DBM' });
    this.arunacore = arunacore;
  }
}
