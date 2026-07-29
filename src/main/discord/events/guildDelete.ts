import { DiscordClient } from '../discord';
import { BaseEvent } from '../structures';
import { Discord } from 'arunabase';

export default class GuildDeleteEvent extends BaseEvent {
  constructor(client: DiscordClient) {
    super('guildDelete', client);
  }

  protected override async execute(guild: Discord.Guild): Promise<void> {
    const guildModel = this.client.getDatabaseConnection().getModel('guild')!;
    await guildModel.delete({ id: guild.id });
  }
}
