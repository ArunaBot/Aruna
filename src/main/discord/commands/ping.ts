import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed } from '../utils';
import { Interfaces } from 'arunabase';

export default class PingCommand extends ArunaAsyncCommand {
  constructor() {
    super('ping', {
      name_localizations: {
        'pt-BR': 'ping',
      },
      description: 'Return the ping of bot and its components',
      description_localizations: {
        'pt-BR': 'Retorna o ping do bot e de seus componentes',
      },
      category: 'Information',
    });
  }

  protected override async execute(context: Interfaces.IDiscordCommandContext): Promise<void> {
    await context.deferReply();
    const embed = new DefaultEmbed()
      .setAuthor({ name: context.client.user!.displayName, iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }) })
      .setDescription(`
        **Discord API Latency:** ${Math.round(context.client.ws.ping)}ms
      `);
    await context.editReply(embed);
  }
}
