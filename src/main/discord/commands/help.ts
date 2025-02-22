import { ArunaAsyncCommand, ArunaCommandBased } from '../structure';
import { Collection } from 'arunabase/build/discord';
import { DefaultEmbed } from '../utils';
import { Interfaces } from 'arunabase';

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

  protected override async execute(context: Interfaces.IDiscordCommandContext): Promise<void> {
    const embed = new DefaultEmbed()
      .setAuthor({ name: context.client.user!.displayName, iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }) })
      .setFooter({
        text: `Requested by ${context.member?.displayName ?? context.author.displayName }`,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ??
          context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      });

    const commands = (context.client.getCommandManager().getGlobalCommands() as unknown as Collection<string, ArunaCommandBased>)
      .filter((c) => c.checkPermission(context, true));

    const categories = commands.map((c) => c.getCategory()).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a.localeCompare(b));

    for (const category of categories) {
      const categoryCommands = commands.filter((c) => c.getCategory() === category);

      embed.addField(category, '```' + categoryCommands.map((c) => c.getName()).join(', ') + '```');
    }

    await context.discreteReply(embed);
  }
}
