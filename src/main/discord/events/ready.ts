import { Discord } from 'arunabase';
import { DiscordClient } from '../discord';
import { BaseEvent } from '../structure';

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
    const presence = `Online for  ${Math.floor((Date.now() - this.readyAt) / 1000)} seconds.`;
    this.discordClient.user!.setActivity(presence, { type: Discord.ActivityType.Listening });
  }
}
