import { getFormattedTime } from '../../utils';
import { AutoPoster } from 'topgg-autoposter';
import { DiscordClient } from '../discord';
import { BaseEvent } from '../structure';
import { Discord } from 'arunabase';

export default class ReadyEvent extends BaseEvent {
  private discordClient: Discord.Client;
  private readyAt: number;

  constructor(client: DiscordClient) {
    super('clientReady', client, true);
    this.readyAt = Date.now();
    this.discordClient = client.getDiscordClient();
  }

  protected override async execute(): Promise<void> {
    await this.client.registerCommands();
    this.updatePresence();
    setInterval(() => this.updatePresence(), 10000);
    this.client.getLogger().info(`Logged in as ${this.discordClient.user!.tag}${this.client.getConfig().shard ? ` on shard ${this.client.getConfig().shardId}` : ''}!`);

    if (this.client.getConfig().topggToken && !this.client.getConfig().shard) {
      const ap = AutoPoster(this.client.getConfig().topggToken!, this.discordClient);

      ap.on('posted', () => {
        this.client.getLogger().info('Posted stats to Top.gg!');
      });
    }
  }

  private async updatePresence(): Promise<void> {
    const presence = `Online for  ${getFormattedTime(Date.now() - this.readyAt)}`;
    this.discordClient.user!.setActivity(presence, { type: Discord.ActivityType.Listening });
  }
}
