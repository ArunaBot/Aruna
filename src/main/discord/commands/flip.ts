import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed } from '../utils';
import { Discord } from 'arunabase';

export default class FlipCommand extends ArunaAsyncCommand {
  constructor() {
    super('flip', {
      name_localizations: {
        'pt-BR': 'moeda',
      },
      description: 'Flips a coin',
      description_localizations: {
        'pt-BR': 'Joga uma moeda',
      },
    });
  }

  protected override async execute(context: Discord.ICommandContext): Promise<void> {
    const embed = new DefaultEmbed()
      .setAuthor({
        name: context.member?.displayName ?? context.author.displayName,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ?? context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setDescription(`
        **Lançamento de moeda:** ${(Math.random() <= 0.5) ? 'Cara' : 'Coroa'}! ${(Math.random() <= 0.5) ? 'Que sorte!' : 'Que azar!'}
      `);
    await context.reply(embed);
  }
}
