import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaCommand } from '../structure';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class GithubCommand extends ArunaCommand {
  constructor() {
    super('support', {
      name_localizations: {
        'pt-BR': 'suporte',
      },
      description: 'Return the support server of the bot',
      description_localizations: {
        'pt-BR': 'Retorna o servidor de suporte do bot',
      },
      category: 'Information',
    });
  }

  protected override execute(context: IDiscordFullCommandContext): void {
    if (!context.urls.discord) {
      context.discreteReply(new ErrorEmbed().setDescription('Sorry, but I don\'t have a support server :('));
      return;
    }

    const embed = new DefaultEmbed()
      .setAuthor({
        name: `Hello, ${context.member?.displayName ?? context.author.displayName}`,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ?? context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setTitle('Support')
      .setURL(context.urls.discord)
      .setColor('#20c277')
      .setDescription(`
        Have you found something weird in me? Do you have any complaints or suggestions for my creators?

        If this is your case, you are in the right place! My support server is just a few clicks away. Doubt? So [click here](${context.urls.discord})!

        Clicked? Now just press the "join" button that appeared on your screen. See how easy it was?
      `);

    context.reply(embed);
  }
}
