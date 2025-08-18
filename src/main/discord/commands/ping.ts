import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaAsyncCommand } from '../structure';
import { getFormattedTime } from '../../utils';
import { DefaultEmbed } from '../utils';

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
      aliases: ['pong', 'latency', 'uptime'],
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply();
    const embed = new DefaultEmbed()
      .setAuthor({ name: context.client.user!.displayName, iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }) })
      .setDescription(`
        **Discord API Latency:** ${Math.round(context.client.ws.ping)}ms
        **Uptime:** ${getFormattedTime(context.client.uptime!)}
      `);
    await context.editReply(embed);
  }
}
