import { DiscordClient } from '../discord';
import { BaseEvent } from '../structure';
import { Discord } from 'arunabase';

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: DiscordClient) {
    super('messageCreate', client);
  }

  protected override async execute(message: Discord.Message): Promise<void> {
    if (message.author.bot) return;
    this.client.getLogger().info(`${message.member?.displayName ?? message.author.tag}: ${message.content}`);
  }
}
