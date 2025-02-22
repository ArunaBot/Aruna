import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaCommand } from '../structure';
import { DefaultEmbed } from '../utils';

export default class InviteCommand extends ArunaCommand {
  constructor() {
    super('invite', {
      name_localizations: {
        'pt-BR': 'convite',
      },
      description: 'Return the bot invite link',
      description_localizations: {
        'pt-BR': 'Retorna o link de convite do bot',
      },
      category: 'Information',
    });
  }

  protected override execute(context: IDiscordFullCommandContext): void {
    const embed = new DefaultEmbed()
      .setAuthor({
        name: `Hello, ${context.member?.displayName ?? context.author.displayName}`,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ?? context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setDescription(`To add me, just click [here](https://discord.com/api/oauth2/authorize?client_id=${context.client.user!.id}&permissions=1426805091543&scope=applications.commands%20bot) and follow the steps in your discord app! (Or you can click in me, and then in "Add to Guild"). (Better Message Soon™)`);

    context.reply(embed);
  }
}
