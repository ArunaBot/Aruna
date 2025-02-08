import { Logger } from '@promisepending/logger.js';
import { ConfigurationLoader } from './api';
import * as Discord from './discord';

async function main(): Promise<void> {
  const configurationLoader = new ConfigurationLoader();
  const configs = configurationLoader.loadConfiguration();

  const debug = configs.debug ?? false;

  const globalLoggerConfig = { ...configs.logger ?? { allLineColored: true, coloredBackground: true }, debug };

  const logger = new Logger({ ...globalLoggerConfig, prefix: 'MAIN' });

  const clients = new Map<string, any>();

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

  /** Start Database */
  // const database = new DataBase();

  /** Start all clients */
  clients.forEach((client) => client.start());
}

main();
