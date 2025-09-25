import { DatabaseManager, MariaDBConnection } from 'promiseorm';
import { Logger } from '@promisepending/logger.js';
import { ConfigurationLoader } from './api';
import { IBaseClient } from './common';
import * as Discord from './discord';

async function main(): Promise<void> {
  const configurationLoader = new ConfigurationLoader();
  const configs = configurationLoader.loadConfiguration();

  const debug = configs.debug ?? false;

  const globalLoggerConfig = { ...configs.logger ?? { allLineColored: true, coloredBackground: true }, debug };

  const logger = new Logger({ ...globalLoggerConfig, prefix: 'MAIN' });

  const clients = new Map<string, any>();

  /** Start Database */
  logger.info('Starting Database...');
  const dbConfig = configs.database;
  const dbmgr = new DatabaseManager();
  const dbConnection = new MariaDBConnection(dbConfig.host, dbConfig.port ?? 3306, dbConfig.credentials.user, dbConfig.credentials.password, dbConfig.credentials.database);
  await dbmgr.registerConnection('global', dbConnection).catch((err => {
    logger.error('Error registering database connection', err);
  })).then(() => {
    logger.info('Database started!');
  });

  if (configs.arunacore) {
    logger.warn('[ArunaCore] Not Implemented Yet! (Really?)');
  }

  if (configs.discord) {
    logger.info('Starting Discord...');
    var discordClient;

    if (configs.discord.shard) {
      discordClient = new Discord.Sharding(configs.discord.token, { ...configs, logger: globalLoggerConfig });
    } else {
      discordClient = new Discord.DiscordClient(configs.discord, globalLoggerConfig, configurationLoader);
    }

    clients.set('discord', discordClient);
  }

  if (configs.twitch) {
    logger.warn('[Twitch] Not Implemented Yet!');
  }

  /** Start all clients */
  clients.forEach((client: IBaseClient) => {
    client.start().then(() => {
      logger.info(`Client ${client.constructor.name} started!`);
    }).catch((err) => {
      // TODO: Handle error and restart client
      logger.error(`Error starting client ${client.constructor.name}`, err);
    });
  });
}

main();
