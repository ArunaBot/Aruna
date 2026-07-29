import { DiscordClient } from '../discord';
import { BaseEvent } from '../structures';
import { Discord } from 'arunabase';

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: DiscordClient) {
    super('messageCreate', client);
  }

  protected override async execute(message: Discord.Message): Promise<void> {
    if (message.author.bot) return;

    if (message.guild) {
      const guildModel = this.client.getDatabaseConnection().getModel('guild')!;
      const guildDB = await guildModel.findOne({ id: message.guild.id });

      if (!guildDB) {
        this.client.getLogger().debug('Guild not found in database, creating new guild entry');
        await guildModel.create({ id: message.guild.id });
      }
    }

    const userModel = this.client.getDatabaseConnection().getModel('user')!;
    const user = await userModel.findOne({ id: message.author.id });

    if (!user) {
      this.client.getLogger().debug('User not found in database, creating new user entry');
      await userModel.create({ id: message.author.id, super: this.client.getCustomProperties().botDevelopers.includes(message.author.id) });
    }
  }
}
