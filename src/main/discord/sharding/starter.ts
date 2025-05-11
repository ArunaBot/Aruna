import { IConfiguration } from '../../common/interfaces';
import { ConfigurationLoader } from '../../api';
import { parentPort } from 'worker_threads';
import { DiscordClient } from '../discord';

parentPort?.on('message', (message: { type: string, data: IConfiguration, shardID: number }) => {
  if (message.type === 'discord.configuration') {
    new DiscordClient(
      { ...message.data.discord!, shardId: message.shardID },
      { ...message.data.logger, prefix: `DISCORD] [SHARD ${message.shardID}` },
      new ConfigurationLoader(),
      message.data.database,
    ).start();
  }
});
