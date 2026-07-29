import {
  ApplicationCommandOptionType,
  ButtonStructure,
  ButtonStyle,
  GuildMember,
  MessageStructure,
  PermissionFlagsBits,
  User,
} from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaAsyncCommand } from '../structures';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class SoftBanCommand extends ArunaAsyncCommand {
  constructor() {
    super('softban', {
      name_localizations: {
        'pt-BR': 'banimento_temporario',
      },
      description: 'Soft ban a member from the server to remove their messages, and then unban them.',
      description_localizations: {
        'pt-BR': 'Bane um membro do servidor para que suas mensagens sejam removidas, e em seguida, o desbane.',
      },
      parameters: [
        {
          name: 'member',
          description: 'The member to soft ban',
          name_localizations: {
            'pt-BR': 'membro',
          },
          description_localizations: {
            'pt-BR': 'O membro que será banido temporariamente',
          },
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'hours',
          description: 'The time, in hours, for which the member\'s message history will be deleted',
          name_localizations: {
            'pt-BR': 'horas',
          },
          description_localizations: {
            'pt-BR': 'O tempo, em horas, para o qual o histórico de mensagens do membro será excluído',
          },
          required: false,
          type: ApplicationCommandOptionType.Integer,
          min_value: 1,
          max_value: 168,
        },
        {
          name: 'reason',
          description: 'The reason for the soft ban',
          name_localizations: {
            'pt-BR': 'motivo',
          },
          description_localizations: {
            'pt-BR': 'O motivo do banimento temporário',
          },
          type: ApplicationCommandOptionType.String,
          required: false,
          min_length: 1,
          max_length: 400,
        },
      ],
      allowDM: false,
      category: 'Moderation',
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply(true);
    if (context.args.size === 0) {
      await context.editReply(new ErrorEmbed().setDescription('You must provide a member to soft ban!'));
      return;
    }

    const guild = context.guild!;

    const user = (context.args.get('member') as User);
    const member = await guild.members.fetch(user.id).catch(() => null) as GuildMember | null;

    const isBanned = await guild.bans.fetch(user.id).then(() => true).catch(() => false);
    if (isBanned) {
      await context.editReply(new ErrorEmbed().setDescription(`The user ${user?.username ?? 'unk'} (${user.id}) is already banned!`));
      return;
    }

    if (user.id === context.author.id) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t soft ban yourself!'));
      return;
    }

    if (user.id === guild.members.me!.id) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t soft ban myself!'));
      return;
    }

    if (user.id === guild.ownerId) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t soft ban the server owner!'));
      return;
    }

    if (member && ((context.author.id !== guild.ownerId) && (context.member!.roles.highest.comparePositionTo(member.roles.highest) <= 0))) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t soft ban a member with a higher or equal role position than you!'));
      return;
    }

    if (member && (context.guild!.members.me!.roles.highest.comparePositionTo(member.roles.highest) <= 0)) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t soft ban a member with a higher or equal role position than me!'));
      return;
    }

    const deleteMessagesHours = (context.args.get('message_history_delete_hours') as number | undefined) ?? 24;
    const reason = (context.args.get('reason') as string || 'No reason provided');

    const confirmationEmbed = new DefaultEmbed()
      .setTitle('**WARNING**')
      .setDescription(`Are you sure you want to soft ban ${user?.username ?? 'unk'} (${user.id})?\nReason: ${reason}\nHistory Deletion Time: ${deleteMessagesHours}h`)
      .setColor('#ff0000');

    const softBanMessage = new DefaultEmbed()
      .setTitle('**Member Soft Banned**')
      .setDescription(`Member: ${user?.username ?? 'unk'} (${user.id})\nReason: ${reason}\nHistory Deleted: ${deleteMessagesHours}h`)
      .setColor('#00ff00');

    const canceledMessage = new DefaultEmbed()
      .setDescription('Operation Canceled!')
      .setColor('#00ff00');

    const youAreSoftBannedMessage = new DefaultEmbed()
      .setTitle('**You are Soft Banned**')
      .setDescription(`Oops, look's like you were softbanned from the guild \`${
        context.guild!.name
      }\` with the reason: \`${reason}\`.\nThe last ${deleteMessagesHours}h of messages were removed.\n\nIf you think this was a mistake, please contact the server owner or an administrator.`)
      .setColor('#ff0000')
      .setFooter({ text: 'This is an automated message, please do not reply to it.' });

    const timeout = setTimeout(async () => {
      await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
        context.client.getLogger().error('SoftBanCommand: Error while editing (timeout)', e);
      });
    }, 30000);

    await context.editReply(
      new MessageStructure(confirmationEmbed)
        .addButton(new ButtonStructure({
          label: 'Confirm',
          emoji: '✅',
          style: ButtonStyle.Danger,
        }, async (ctx) => {
          clearTimeout(timeout);
          if (member) await member.send({ embeds: [youAreSoftBannedMessage] }).catch(() => {});

          try {
            await guild.bans.create(user.id, {
              reason: `Softbanned By: ${context.author.username} (${context.author.id}) | History Deleted: ${deleteMessagesHours}h | Reason: ${reason}`,
              deleteMessageSeconds: deleteMessagesHours * 3600,
            });

            await guild.bans.remove(user.id, `Automated unban after softban | Softbanned By: ${context.author.username} (${context.author.id})`);

            await context.editReply(new MessageStructure(softBanMessage)).catch((e) => {
              context.client.getLogger().error('SoftBanCommand: Error while editing message (softban)', e);
            });
          } catch (e: any) {
            context.client.getLogger().error('SoftBanCommand: Error while soft banning user', e);
            await context.editReply(new MessageStructure(new ErrorEmbed().setDescription(`An error occurred while trying to soft ban the user: \`${e.message}\``)))
              .catch((editError) => {
                context.client.getLogger().error('SoftBanCommand: Error while editing message (softban error)', editError);
              });
          }

          await ctx.deferUpdate().catch(() => {});
        }))
        .addButton(new ButtonStructure({
          label: 'Cancel',
          emoji: '❌',
          style: ButtonStyle.Secondary,
        }, async (ctx) => {
          clearTimeout(timeout);
          await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
            context.client.getLogger().error('SoftBanCommand: Error while editing message (cancel)', e);
          });
          await ctx.deferUpdate().catch(() => {});
        })),
    );
  }

  public override checkPermission(context: IDiscordFullCommandContext, silent = false): boolean {
    if (!context.member!.permissions.has(PermissionFlagsBits.BanMembers)) {
      if (!silent) context.discreteReply(new ErrorEmbed().setDescription('You don\'t have the ban members permission!'));
      return false;
    }

    if (!context.guild!.members.me!.permissions.has(PermissionFlagsBits.BanMembers)) {
      if (!silent) context.discreteReply(
        new ErrorEmbed().setDescription('I don\'t have the ban members permission!\nPlease, contact the server owner or an administrator to give me this permission.'),
      );
      return false;
    }

    if (!context.guild!.members.me!.permissions.has(PermissionFlagsBits.ManageMessages)) {
      if (!silent) context.discreteReply(
        new ErrorEmbed().setDescription('I don\'t have the manage messages permission!\nPlease, contact the server owner or an administrator to give me this permission.'),
      );
      return false;
    }

    return true;
  }
}
