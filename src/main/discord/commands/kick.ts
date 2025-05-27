import { ApplicationCommandOptionType, ButtonStructure, ButtonStyle, GuildMember, MessageStructure, PermissionFlagsBits, User } from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class KickCommand extends ArunaAsyncCommand {
  constructor() {
    super('kick', {
      name_localizations: {
        'pt-BR': 'expulsar',
      },
      description: 'Kick a member from the server',
      description_localizations: {
        'pt-BR': 'Expulse um membro do servidor',
      },
      parameters: [
        {
          name: 'member',
          description: 'The member to kick',
          name_localizations: {
            'pt-BR': 'membro',
          },
          description_localizations: {
            'pt-BR': 'O membro que será expulso',
          },
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'reason',
          description: 'The reason for the kick',
          name_localizations: {
            'pt-BR': 'motivo',
          },
          description_localizations: {
            'pt-BR': 'O motivo da expulsão',
          },
          required: false,
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
    if (context.args.length === 0) {
      await context.editReply(new ErrorEmbed().setDescription('You must provide a member to kick!'));
      return;
    }

    const guild = context.guild!;

    let member: GuildMember | null = null;
    if (context.args[0] instanceof User) member = await guild.members.fetch(context.args[0].id).catch(() => null);
    else if (context.message?.mentions.members?.first()) member = context.message!.mentions.members.first()!;
    else {
      member = (await guild.members.fetch((context.args[0] as string)).catch(() => null));
    }
      
    
    if (!member) {
      await context.editReply(new ErrorEmbed().setDescription(`Member ${context.args[0]} was not found!`));
      return;
    }

    if (member.id === context.author.id) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t kick yourself!'));
      return;
    }

    if (member.id === guild.members.me!.id) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t kick myself!'));
      return;
    }

    if (member.id === guild.ownerId) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t kick the server owner!'));
      return;
    }

    if ((context.author.id !== guild.ownerId) && (context.member!.roles.highest.comparePositionTo(member.roles.highest) <= 0)) {
      await context.editReply(new ErrorEmbed().setDescription('You can\'t kick a member with a higher or equal role position than you!'));
      return;
    }

    if (context.guild!.members.me!.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      await context.editReply(new ErrorEmbed().setDescription('I can\'t kick a member with a higher or equal role position than me!'));
      return;
    }

    const reason = context.args.slice(1).join(' ') || 'No reason provided';

    const confirmationEmbed = new DefaultEmbed()
      .setTitle('**WARNING**')
      .setDescription(`Are you sure you want to kick ${member.user.username} (${member.id})?\nReason: ${reason}`)
      .setColor('#ff0000');

    const kickMessage = new DefaultEmbed()
      .setTitle('**Member Kicked**')
      .setDescription(`Member: ${member.user.username} (${member.id})\nReason: ${reason}`)
      .setColor('#00ff00');

    const canceledMessage = new DefaultEmbed()
      .setDescription('Operation canceled!')
      .setColor('#00ff00');

    const youAreKickedMessage = new DefaultEmbed()
      .setTitle('**You are Kicked**')
      .setDescription(`Oops, look's like you were kicked from the guild \`${
        context.guild!.name
      }\` with the reason: \`${reason}\`.\n\nIf you think this was a mistake, please contact the server owner or an administrator.`)
      .setColor('#ff0000')
      .setFooter({ text: 'This is an automated message, please do not reply to it.' });

    const timeout = setTimeout(async () => {
      await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
        context.client.getLogger().error('KickCommand: Error while editing (timeout)', e);
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
          await member!.send({ embeds: [youAreKickedMessage] }).catch(() => {});
          await member!.kick(`Kicked By: ${context.author.username} | Reason: ${reason}`).catch((e) => {
            context.client.getLogger().error('KickCommand: Error while kicking member', e);
            context.editReply(new MessageStructure(new ErrorEmbed().setDescription(`An error occurred while trying to kick the member: \`${e.message}\``)))
              .catch((e) => {
                context.client.getLogger().error('KickCommand: Error while editing message (kick)', e);
              });
          });
          await context.editReply(new MessageStructure(kickMessage)).catch((e) => {
            context.client.getLogger().error('KickCommand: Error while editing message (kick)', e);
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
            context.client.getLogger().error('KickCommand: Error while editing message (cancel)', e);
          });
          await ctx.deferUpdate().catch(() => {});
        })),
    );
  }

  public override checkPermission(context: IDiscordFullCommandContext, silent = false): boolean {
    if (!context.member!.permissions.has(PermissionFlagsBits.KickMembers)) {
      if (!silent) context.discreteReply(new ErrorEmbed().setDescription('You don\'t have the kick members permission!'));
      return false;
    }

    if (!context.guild!.members.me!.permissions.has(PermissionFlagsBits.KickMembers)) {
      if (!silent) context.discreteReply(
        new ErrorEmbed().setDescription('I don\'t have the kick members permission!\nPlease, contact the server owner or an administrator to give me this permission.'),
      );
      return false;
    }

    return true;
  }
}
