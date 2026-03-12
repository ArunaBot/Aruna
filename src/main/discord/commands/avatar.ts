import { ArunaCommand } from '../structure';
import { DefaultEmbed } from '../utils';
import { Discord } from 'arunabase';

export default class AvatarCommand extends ArunaCommand {
  constructor() {
    super('avatar', {
      name_localizations: {
        'pt-BR': 'avatar',
      },
      description: 'Send the user avatar',
      description_localizations: {
        'pt-BR': 'Envia o avatar de um usuário',
      },
      parameters: [
        {
          name: 'user',
          description: 'The target user',
          name_localizations: {
            'pt-BR': 'usuário',
          },
          description_localizations: {
            'pt-BR': 'O usuário alvo',
          },
          required: false,
          type: Discord.ApplicationCommandOptionType.User,
        },
        {
          name: 'local',
          description: 'If should display guild avatar (if available) or global avatar',
          name_localizations: {
            'pt-BR': 'local',
          },
          description_localizations: {
            'pt-BR': 'Se deve exibir o avatar do servidor (se disponível) ou o avatar global',
          },
          required: false,
          type: Discord.ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'global',
              name_localizations:
              {
                'pt-BR': 'global',
              },
              value: 'global',
            },
            {
              name: 'guild',
              name_localizations:
              {
                'pt-BR': 'servidor',
              },
              value: 'guild',
            },
          ],
        },
      ],
    });
  }

  protected override execute(context: Discord.ICommandContext): void {
    const target = context.args.get('user') as Discord.User || context.author;
    const local = context.args.get('local') as string || 'global';

    let avatar = target.displayAvatarURL({ forceStatic: false, size: 4096, extension: 'png' });

    if (local === 'guild' && context.guild) {
      const member = context.guild.members.cache.get(target.id);
      if (member && member.avatar) avatar = member.displayAvatarURL({ forceStatic: false, size: 4096, extension: 'png' });
    }

    context.reply(
      new DefaultEmbed()
        .setImage(avatar)
        .setColor('#333333')
        .setDescription(`Avatar of ${target.displayName}`),
    );
  }
}
