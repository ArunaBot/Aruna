import { ApplicationCommandOptionType, ButtonStructure, ButtonStyle, GuildMember, MessageStructure, PermissionFlagsBits, User } from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class BanCommand extends ArunaAsyncCommand {
  constructor() {
    super('ban', {
      name_localizations: {
        'pt-BR': 'banir',
      },
      description: 'Ban a member from the server',
      description_localizations: {
        'pt-BR': 'Bana um membro do servidor',
      },
      parameters: [
        {
          name: 'member',
          description: 'The member to ban',
          name_localizations: {
            'pt-BR': 'membro',
          },
          description_localizations: {
            'pt-BR': 'O membro que será banido',
          },
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'reason',
          description: 'The reason for the ban',
          name_localizations: {
            'pt-BR': 'motivo',
          },
          description_localizations: {
            'pt-BR': 'O motivo do banimento',
          },
          type: ApplicationCommandOptionType.String,
          min_length: 1,
          max_length: 450,
        },
      ],
      allowDM: false,
      category: 'Moderation',
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply(true);
    if (context.args.size === 0) {
      await context.editReply(new ErrorEmbed().setDescription('You must provide a member to ban!'));
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
      await context.editReply(new ErrorEmbed().setDescription('You can\'t ban yourself!'));
      return;
    }

    if (user.id === guild.members.me!.id) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t ban myself!'));
      return;
    }

    if (user.id === guild.ownerId) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t ban the server owner!'));
      return;
    }

    if (member && ((context.author.id !== guild.ownerId) && (context.member!.roles.highest.comparePositionTo(member.roles.highest) <= 0))) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t ban a member with a higher or equal role position than you!'));
      return;
    }

    if (member && (context.guild!.members.me!.roles.highest.comparePositionTo(member.roles.highest) <= 0)) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t ban a member with a higher or equal role position than me!'));
      return;
    }
    const reason = (context.args.get('reason') as string || 'No reason provided');

    const confirmationEmbed = new DefaultEmbed()
      .setTitle('**WARNING**')
      .setDescription(`Are you sure you want to ban ${user?.username ?? 'unk'} (${user.id})?\nReason: ${reason}`)
      .setColor('#ff0000');

    const banMessage = new DefaultEmbed()
      .setTitle('**Member Banned**')
      .setDescription(`Member: ${user?.username ?? 'unk'} (${user.id})\nReason: ${reason}`)
      .setColor('#00ff00');

    const canceledMessage = new DefaultEmbed()
      .setDescription('Operation Canceled!')
      .setColor('#00ff00');

    const youAreBannedMessage = new DefaultEmbed()
      .setTitle('**You are Banned**')
      .setDescription(`Oops, look's like you were banned from the guild \`${
        context.guild!.name
      }\` with the reason: \`${reason}\`.\n\nIf you think this was a mistake, please contact the server owner or an administrator.`)
      .setColor('#ff0000')
      .setFooter({ text: 'This is an automated message, please do not reply to it.' });

    const timeout = setTimeout(async () => {
      await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
        context.client.getLogger().error('BanCommand: Error while editing (timeout)', e);
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
          if (member) await member.send({ embeds: [youAreBannedMessage] }).catch(() => {});

          await guild.bans.create(user.id, { reason: `Banned By: ${context.author.username} (${context.author.id}) | Reason: ${reason}` }).catch((e) => {
            context.client.getLogger().error('BanCommand: Error while banning user', e);
            context.editReply(new MessageStructure(new ErrorEmbed().setDescription(`An error occurred while trying to ban the user: \`${e.message}\``)))
              .catch((e) => {
                context.client.getLogger().error('BanCommand: Error while editing message (ban)', e);
              });
          }).then(async () => {
            await context.editReply(new MessageStructure(banMessage)).catch((e) => {
              context.client.getLogger().error('BanCommand: Error while editing message (ban)', e);
            });
          });
          
          await ctx.deferUpdate().catch(() => {});
        }))
        .addButton(new ButtonStructure({
          label: 'Cancel',
          emoji: '❌',
          style: ButtonStyle.Secondary,
        }, async (ctx) => {
          clearTimeout(timeout);
          await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
            context.client.getLogger().error('BanCommand: Error while editing message (cancel)', e);
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

    return true;
  }
}
