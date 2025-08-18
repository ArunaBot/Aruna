import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaCommand } from '../structure';
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
    const client = context.client;

    if (context.args[0] && ((context.args[0] as string).toLowerCase() === 'global' || (context.args[0] as string).toLowerCase() === 'guild')) {
      context.args.push(context.args[0]);
      context.args[0] = context.author.id;
    }

    const targetRaw = (context.args[0] as string)?.replace(/[<@!>]/g, '');

    var target;

    if (context.args[1] === 'guild') {
      target = context.guild?.members.cache.get(targetRaw || context.author.id)?.user;
    }

    if (!target && (targetRaw || (!context.args[1] || context.args[1] === 'global'))) target = client.users.cache.get(targetRaw || context.author.id);

    if (!target) {
      context.discreteReply(new ErrorEmbed().setDescription('Target not found!'));
      return;
    }

    context.reply(
      new DefaultEmbed()
        .setImage(target.displayAvatarURL({ forceStatic: false, size: 4096, extension: 'png' }))
        .setColor('#333333')
        .setDescription(`Avatar of ${target.displayName}`),
    );
  }
}
