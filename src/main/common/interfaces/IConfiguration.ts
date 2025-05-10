import { ILoggerOptions } from '@promisepending/logger.js';
import { Discord } from 'arunabase';

/**
 * id?
 * debug?
 * discord {}
 * twitch {}
 * arunacore {}
 */

export interface IDiscordConfiguration {
  discord?: {
    token: string;
    defaultPrefix?: string;
    clientID?: string;
    shardingOptions?: Discord.ShardingManagerOptions
    partials?: Discord.Partials[],
    intents: Discord.BitFieldResolvable<Discord.GatewayIntentsString, number>[],
    shard?: boolean,
  }
}

export interface ITwitchConfiguration {
  twitch?: {
    token: string;
  }
}

export interface IArunaCoreConfiguration {
  arunacore?: {
    host: string;
    port: string;
    options?: {
      sharding?: boolean;
      securityToken?: string;
    }
  }
}

export interface IDatabaseConfiguration {
  database: {
    host: string;
    port?: string;
    type?: string;
    credentials: {
      database: string;
      user: string;
      password: string;
    }
  }
}

export interface ILoggerConfiguration {
  logger?: ILoggerOptions;
}

export interface IConfiguration extends IDiscordConfiguration, ITwitchConfiguration, IArunaCoreConfiguration, IDatabaseConfiguration, ILoggerConfiguration {
  fileVersion: number;
  id?: string;
  debug?: boolean;
}
