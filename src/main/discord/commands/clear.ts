import { IDiscordFullCommandContext } from '../interfaces';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';
import { Discord } from 'arunabase';
import { sleep } from '../../utils';

export default class ClearCommand extends ArunaAsyncCommand {
  constructor() {
    super('clear', {
      name_localizations: {
        'pt-BR': 'limpar',
      },
      description: 'Clears a specific amount of messages from the chat',
      description_localizations: {
        'pt-BR': 'Limpa uma quantidade específica de mensagens do chat',
      },
      parameters: [
        {
          name: 'amount',
          description: 'The amount of messages to be deleted',
          description_localizations: {
            'pt-BR': 'A quantidade de mensagens a serem deletadas',
          },
          required: true,
          type: Discord.ApplicationCommandOptionType.Integer,
          min_value: 2,
          max_value: 100,
        },
      ],
      allowDM: false,
      category: 'Moderation',
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    var amount = context.args[0] as number;

    if (!amount) {
      await context.discreteReply(new ErrorEmbed().setDescription('You must specify the amount of messages to be deleted!'));
      return;
    }

    if (amount > 100) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can only delete up to 100 messages at a time!'));
      return;
    }

    if (amount < 2) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can only delete at least 2 messages at a time!'));
      return;
    }

    if (context.interaction) await context.interaction.deferReply({ ephemeral: true });

    try {
      const deletedMessagesSize = (await (context.channel as Discord.TextChannel)!.bulkDelete(amount)).size;

      if (deletedMessagesSize < amount && deletedMessagesSize > 0) {
        await context.editReply(
          new DefaultEmbed()
            .setDescription(
              `Succefully deleted \`${deletedMessagesSize}\` messages, but \`${amount}\` messages were requested.\n` +
              'This is probably because some of the messages are older than 14 days or doesn\'t exists.',
            ),
        );
      } else if (deletedMessagesSize === 0) {
        await context.editReply(
          new DefaultEmbed()
            .setDescription(
              'I was unable to delete the messages!\n\n' +
              'This is probably because these messages are older than 14 days or doesn\'t exists.',
            ),
        );
      } else {
        await context.editReply(new DefaultEmbed().setDescription(`Succefully deleted \`${amount}\` messages!`));
      }

      if (!context.interaction) sleep(10000).then(() => { try { context.deleteReply(); } finally { /* empty */ } });
    } catch (error) {
      context.client.getLogger().error('Error while deleting messages: ', error);
      await context.editReply(new ErrorEmbed().setDescription('I was unable to delete the messages!'));
    }
  }

  public override checkPermission(context: Discord.ICommandContext, silent = false): boolean {
    if (!context.member!.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      if (!silent) context.discreteReply(new ErrorEmbed().setDescription('You don\'t have the manage messages permission!'));
      return false;
    }

    if (!context.guild!.members.cache.get(context.client.user!.id)!.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      if (!silent) context.reply(new ErrorEmbed().setDescription('I don\'t have the permission to delete messages!'));
      return false;
    }

    return true;
  }
}
