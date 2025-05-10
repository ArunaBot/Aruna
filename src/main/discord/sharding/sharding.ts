import { Logger } from '@promisepending/logger.js';
import { IConfiguration } from '../../common/interfaces';
import { IBaseClient } from '../../common';
import { Discord } from 'arunabase';
import path from 'path';

export class Sharding implements IBaseClient {
  private readonly token: string;

  private manager: Discord.ShardingManager | null = null;
  private options: IConfiguration;
  private logger: Logger;

  constructor(token: string, options: IConfiguration) {
    this.token = token;
    this.options = { ...options, discord: { ...options.discord!, shardingOptions: { token, mode: 'worker' } } };
    this.logger = new Logger({ ...options.logger, prefix: 'DISCORD] [SHARDING', debug: options.debug });
  }

  public start(): void {
    this.manager = new Discord.ShardingManager(path.join(__dirname, 'starter.js'), this.options.discord!.shardingOptions!);
    this.manager.on('shardCreate', shard => {
      this.logger.info(`Launched shard ${shard.id}`);
      shard.once('spawn', () => {
        this.logger.info(`Spawned ${shard.id}`);
        shard.worker!.postMessage({ type: 'discord.configuration', data: this.options, shardID: shard.id });
      });
    });
    this.manager.spawn();
  }
}
