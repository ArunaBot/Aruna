import { ArunaAsyncCommand, ArunaCommandBased } from '../structures';
import { DefaultEmbed } from '../utils';
import { Discord } from 'arunabase';

export default class HelpCommand extends ArunaAsyncCommand {
  constructor() {
    super('help', {
      name_localizations: {
        'pt-BR': 'ajuda',
      },
      description: 'Shows bot commands',
      description_localizations: {
        'pt-BR': 'Exibe os comandos do bot',
      },
      isSlashCommand: false,
      category: 'Information',
    });
  }

  protected override async execute(context: Discord.ICommandContext): Promise<void> {
    const embed = new DefaultEmbed()
      .setAuthor({
        name: `${context.client.user!.displayName} - ${context.isDM ? 'DM Commands' : 'Guild Commands'}`,
        iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setFooter({
        text: `Requested by ${context.member?.displayName ?? context.author.displayName }`,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ??
          context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      });

    const commands = (context.client.getCommandManager().getCommands() as ArunaCommandBased[])
      .filter((c) => {
        return (c.isDMAllowed() && context.isDM) && c.checkPermission(context, true);
      });

    const categories = commands.map((c) => c.getCategory()).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a.localeCompare(b));

    for (const category of categories) {
      const categoryCommands = commands.filter((c) => c.getCategory() === category);

      embed.addField(category, '```' + categoryCommands.map((c) => c.getName()).join(', ') + '```');
    }

    await context.discreteReply(embed);
  }
}
