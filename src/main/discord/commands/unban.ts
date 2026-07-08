import { 
  ApplicationCommandOptionType,
  ButtonStructure,
  ButtonStyle,
  MessageStructure,
  PermissionFlagsBits,
} from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';

export default class UnBanCommand extends ArunaAsyncCommand {
  constructor() {
    super('unban', {
      name_localizations: {
        'pt-BR': 'desbanir',
      },
      description: 'Unban a user from the server',
      description_localizations: {
        'pt-BR': 'Remover o banimento de um usuário do servidor',
      },
      parameters: [
        {
          name: 'user',
          description: 'The id of the user to unban',
          name_localizations: {
            'pt-BR': 'usuário',
          },
          description_localizations: {
            'pt-BR': 'O usuário que terá o banimento removido',
          },
          required: true,
          type: ApplicationCommandOptionType.String,
          min_length: 18,
          max_length: 19,
        },
        {
          name: 'reason',
          description: 'The reason for the unban',
          name_localizations: {
            'pt-BR': 'motivo',
          },
          description_localizations: {
            'pt-BR': 'O motivo para remover o banimento',
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
      await context.editReply(new ErrorEmbed().setDescription('You must provide a user id to unban!'));
      return;
    }

    const guild = context.guild!;

    const userId: string = context.args.get('user') as string;
    const user = await context.client.getRawClient().users.fetch(userId).catch(() => null);

    const isBanned = await guild.bans.fetch(userId).then(() => true).catch(() => false);
    if (!isBanned) {
      await context.editReply(new ErrorEmbed().setDescription(`The user ${user?.username ?? 'unk'} (${userId}) isn't banned!`));
      return;
    }

    const reason = context.args.get('reason') || 'No reason provided';

    const confirmationEmbed = new DefaultEmbed()
      .setTitle('**WARNING**')
      .setDescription(`Are you sure you want to unban ${user?.username ?? 'unk'} (${userId})?\nReason: ${reason}`)
      .setColor('#ff0000');

    const unbanMessage = new DefaultEmbed()
      .setTitle('**User Unbanned**')
      .setDescription(`User: ${user?.username ?? 'unk'} (${userId})\nReason: ${reason}`)
      .setColor('#00ff00');

    const canceledMessage = new DefaultEmbed()
      .setDescription('Operation Canceled!')
      .setColor('#00ff00');

    const timeout = setTimeout(async () => {
      await context.editReply(new MessageStructure(canceledMessage)).catch((e) => {
        context.client.getLogger().error('UnBanCommand: Error while editing (timeout)', e);
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
          await guild.bans.remove(userId, `Unbanned By: ${context.author.username} (${context.author.id}) | Reason: ${reason}`).catch((e) => {
            context.client.getLogger().error('UnBanCommand: Error while unbanning user', e);
            context.editReply(new MessageStructure(new ErrorEmbed().setDescription(`An error occurred while trying to unban the user: \`${e.message}\``)))
              .catch((e) => {
                context.client.getLogger().error('UnBanCommand: Error while editing message (unban)', e);
              });
          }).then(async () => {
            await context.editReply(new MessageStructure(unbanMessage)).catch((e) => {
              context.client.getLogger().error('UnBanCommand: Error while editing message (unban)', e);
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
            context.client.getLogger().error('UnBanCommand: Error while editing message (cancel)', e);
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
