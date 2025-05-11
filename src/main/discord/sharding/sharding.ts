import { IConfiguration } from '../../common/interfaces';
import { Logger } from '@promisepending/logger.js';
import { IBaseClient } from '../../common';
import { Discord } from 'arunabase';
import path from 'path';

export class Sharding implements IBaseClient {
  private manager: Discord.ShardingManager | null = null;
  private options: IConfiguration;
  private logger: Logger;

  constructor(token: string, options: IConfiguration) {
    this.options = { ...options, discord: { ...options.discord!, shardingOptions: { token, mode: 'worker' } } };
    this.logger = new Logger({ ...options.logger, prefix: 'DISCORD] [SHARDING', debug: options.debug });
  }

  public async start(): Promise<void> {
    return new Promise((_, reject) => {
      this.manager = new Discord.ShardingManager(path.join(__dirname, 'starter.js'), this.options.discord!.shardingOptions!);
      this.manager.on('shardCreate', (shard) => {
        this.logger.info(`Launched shard ${shard.id}`);
        shard.once('spawn', () => {
          this.logger.info(`Spawned ${shard.id}`);
        shard.worker!.postMessage({ type: 'discord.configuration', data: this.options, shardID: shard.id });
        });
        shard.once('death', () => {
          this.logger.error(`Shard ${shard.id} died.`);
        });
        shard.once('disconnect', () => {
          this.logger.error(`Shard ${shard.id} disconnected.`);
        });
        shard.once('error', (error: Error) => {
          this.logger.error(`Error on shard ${shard.id}`, error);
        });
      });
      this.manager.spawn().catch((error) => {
        this.logger.error('Error spawning shards', error);
        reject(error);
      });
    });
  };
}
