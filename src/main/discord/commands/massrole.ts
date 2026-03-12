import { ApplicationCommandOptionType, PermissionFlagsBits, Role } from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';
import { Discord } from 'arunabase';

export default class MassRoleCommand extends ArunaAsyncCommand {
  constructor() {
    super('massrole', {
      name_localizations: {
        'pt-BR': 'massrole',
      },
      description: 'Applies a role to all members in the guild',
      description_localizations: {
        'pt-BR': 'Adiciona um cargo a todos os membros do servidor',
      },
      category: 'Moderation',
      aliases: ['masscargo', 'cargomassivo'],
      allowDM: false,
      parameters: [
        {
          name: 'role',
          description: 'The role to apply to all members',
          name_localizations: {
            'pt-BR': 'cargo',
          },
          description_localizations: {
            'pt-BR': 'O cargo que será adicionado a todos os membros',
          },
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
        {
          name: 'group',
          description: 'The group of members to apply the role to (e.g., "all", "bots", "humans")',
          name_localizations: {
            'pt-BR': 'grupo',
          },
          description_localizations: {
            'pt-BR': 'O grupo de membros ao qual o cargo será adicionado (ex: "todos", "bots", "humanos")',
          },
          required: false,
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'All Members',
              name_localizations: { 'pt-BR': 'Todos os membros' },
              value: 'all',
            },
            {
              name: 'Bots',
              name_localizations: { 'pt-BR': 'Bots' },
              value: 'bots',
            },
            {
              name: 'Humans',
              name_localizations: { 'pt-BR': 'Humanos' },
              value: 'humans',
            },
          ],
        },
        {
          name: 'date_filter',
          description: 'Filter members by join date (e.g., "2024-01-01")',
          name_localizations: {
            'pt-BR': 'filtro_de_data',
          },
          description_localizations: {
            'pt-BR': 'Filtra membros pela data de entrada (ex: "2024-01-01")',
          },
          required: false,
          type: ApplicationCommandOptionType.String,
          min_length: 10,
          max_length: 10,
        },
      ],
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply();

    const role: Role = context.args.get('role') as Role;

    if (role.managed) {
      await context.editReply(new ErrorEmbed().setDescription('You cannot apply a managed role!'));
      return;
    }

    if (role.position >= context.member!.roles.highest.position && context.member!.id !== context.guild!.ownerId) {
      await context.editReply(new ErrorEmbed().setDescription('You cannot apply a role that is higher than your highest role!'));
      return;
    }

    if (role.position >= context.guild!.members.me!.roles.highest.position) {
      await context.editReply(new ErrorEmbed().setDescription('I cannot apply a role that is higher than my highest role!'));
      return;
    }

    const group = (context.args.get('group') as string) || 'all';
    const dateFilter: string | null = context.args.get('date_filter') as string || null;

    if (!['all', 'bots', 'humans'].includes(group)) {
      await context.editReply(new DefaultEmbed().setDescription('Invalid group specified! Use "all", "bots", or "humans".'));
      return;
    }

    const totalMembers = context.guild!.memberCount;

    if (totalMembers > 500) {
      await context.editReply(new DefaultEmbed()
        .setDescription('Unfortunately, this command cannot be used on servers with more than 500 members for now. We are working on a solution!'));
      return;
    }

    const members = await context.guild!.members.list({ limit: 500 });
    let membersToUpdate = group === 'all' ? members : members.filter(m => (group === 'bots' ? m.user.bot : !m.user.bot) && !(m.roles.cache.has(role.id)));
    if (dateFilter) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
        const filterDate = new Date(dateFilter);
        membersToUpdate = membersToUpdate.filter(m => m.joinedAt && m.joinedAt <= filterDate);
      }
    }

    if (membersToUpdate.size === 0) {
      await context.editReply(new DefaultEmbed().setDescription('No members found to apply the role to!'));
      return;
    }

    await context.editReply(new DefaultEmbed()
      .setDescription(`Applying role **${role.name}** to ${membersToUpdate.size} members...\nThis may take a while, please be patient.`)
      .setColor(role.colors?.primaryColor || '#00ff00'));

    let successCount: number = 0;
    let failedCount: number = 0;

    for await (const [_, member] of membersToUpdate) {
      try {
        await member.roles.add(role);
        successCount++;
      } catch (error) {
        context.client.getLogger().debug(`Failed to add role ${role.name} to member ${member.user.username}:`, error);
        failedCount++;
      }
    }

    const embed = new DefaultEmbed()
      .setTitle('Operation Complete')
      .setDescription(
        `Successfully applied role **${role.name}** to **${successCount}** members.${failedCount > 0 ? `\nFailed to apply role to **${failedCount}** members.` : ''}`,
      )
      .setColor('#00ff00');

    await context.editReply(embed);
  }

  public override checkPermission(context: Discord.ICommandContext, silent?: boolean): boolean {
    if (!context.member!.permissions.has(PermissionFlagsBits.ManageRoles)) {
      if (!silent) context.discreteReply(new ErrorEmbed().setDescription('You don\'t have the manage roles permission!'));
      return false;
    }
    
    if (!context.guild!.members.me!.permissions.has(PermissionFlagsBits.ManageRoles)) {
      if (!silent) context.discreteReply(
        new ErrorEmbed().setDescription('I don\'t have the manage roles permission!\nPlease, contact the server owner or an administrator to give me this permission.'),
      );
      return false;
    }
    
    return true;
  }
}
