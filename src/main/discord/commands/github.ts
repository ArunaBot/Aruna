import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaCommand } from '../structure';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class GithubCommand extends ArunaCommand {
  constructor() {
    super('github', {
      description: 'Return the github repository of the bot',
      description_localizations: {
        'pt-BR': 'Retorna o repositório do bot no github',
      },
      category: 'Information',
    });
  }

  protected override execute(context: IDiscordFullCommandContext): void {
    if (!context.urls.github) {
      context.discreteReply(new ErrorEmbed().setDescription('Sorry, but I don\'t have a github repository :('));
      return;
    }

    const embed = new DefaultEmbed()
      .setAuthor({
        name: `Hello, ${context.member?.displayName ?? context.author.displayName}`,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ?? context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setTitle('Github')
      .setURL(context.urls.github)
      .setColor('#20c277')
      .setThumbnail('https://avatars.githubusercontent.com/u/63735353?s=48&v=4')
      .setDescription(`
        Hey, I'm Aruna, a bot made by [Lobo Metalurgico](https://github.com/LoboMetalurgico) using [ArunaBase](https://github.com/ArunaBot/ArunaBase)!

        You can see my source code [here](${context.urls.github})!

        If you want to contribute to my development, you can do it [here](${context.urls.github}/pulls)!
        Also, if you want to report a bug, you can do it [here](${context.urls.github}/issues)!
        And if you want to suggest a new feature, you can do it [here](${context.urls.github}/issues)!
        Any help is welcome! :D
      `);

    context.reply(embed);
  }
}
