import { ConfigurationLoader } from '../../api';
import { IConfiguration } from '../../interfaces';
import { parentPort } from 'worker_threads';
import { DiscordClient } from '../discord';

parentPort?.on('message', (message: { type: string, data: IConfiguration, shardID: number }) => {
  if (message.type === 'discord.configuration') {
    new DiscordClient(message.data.discord!, { ...message.data.logger, prefix: `DISCORD] [SHARD ${message.shardID}` }, new ConfigurationLoader()).start();
  }
});
