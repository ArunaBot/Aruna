import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';
import { Interfaces } from 'arunabase';

export default class GuildIconCommand extends ArunaAsyncCommand {
  constructor() {
    super('guildicon', {
      name_localizations: {
        'pt-BR': 'servericon',
      },
      description: 'Send the server icon',
      description_localizations: {
        'pt-BR': 'Envia o ícone do servidor',
      },
      allowDM: false,
      aliases: ['sicon', 'gicon'],
    });
  }

  protected override async execute(context: Interfaces.IDiscordCommandContext): Promise<void> {
    const guild = context.guild!;
    const icon = guild.iconURL({ size: 4096, forceStatic: false, extension: 'png' });

    if (!icon) {
      await context.discreteReply(new ErrorEmbed().setDescription('This guild doesn\'t have an icon!'));
      return;
    }

    await context.reply(
      new DefaultEmbed()
        .setImage(icon)
        .setColor('#333333')
        .setDescription(`Icon of ${guild.name}`),
    );
  }
}
