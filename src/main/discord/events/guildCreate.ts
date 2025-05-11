import { DiscordClient } from '../discord';
import { BaseEvent } from '../structure';
import { Discord } from 'arunabase';

export default class GuildCreateEvent extends BaseEvent {
  constructor(client: DiscordClient) {
    super('guildCreate', client);
  }

  protected override async execute(guild: Discord.Guild): Promise<void> {
    const guildModel = this.client.getDatabaseConnection().getModel('guild')!;
    const guildDB = await guildModel.findOne({ id: guild.id });

    if (guildDB) return;

    this.client.getLogger().debug('Guild not found in database, creating new guild entry');
    await guildModel.create({ id: guild.id });
  }
}
