import { getFormattedTime } from '../../utils';
import { DiscordClient } from '../discord';
import { BaseEvent } from '../structure';
import { Discord } from 'arunabase';

export default class ReadyEvent extends BaseEvent {
  private readyAt: number;
  private discordClient: Discord.Client;

  constructor(client: DiscordClient) {
    super('ready', client, true);
    this.readyAt = Date.now();
    this.discordClient = client.getDiscordClient();
  }

  protected override async execute(): Promise<void> {
    this.client.getLogger().info(`Logged in as ${this.discordClient.user!.tag}!`);
    await this.client.registerCommands();
    this.updatePresence();
    setInterval(() => this.updatePresence(), 10000);
  }

  private async updatePresence(): Promise<void> {
    const presence = `Online for  ${getFormattedTime(Date.now() - this.readyAt)}`;
    this.discordClient.user!.setActivity(presence, { type: Discord.ActivityType.Listening });
  }
}
