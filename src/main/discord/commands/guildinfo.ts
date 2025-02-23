import { IDiscordFullCommandContext } from '../interfaces';
import { ChannelType } from 'arunabase/build/discord';
import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed } from '../utils';

export default class ServerInfoCommand extends ArunaAsyncCommand {
  constructor() {
    super('guildinfo', {
      name_localizations: {
        'pt-BR': 'serverinfo',
      },
      description: 'Return some information about the server',
      description_localizations: {
        'pt-BR': 'Retorna algumas informações sobre o servidor',
      },
      category: 'Information',
      aliases: ['si', 'gi'],
      allowDM: false,
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply();
    const embed = new DefaultEmbed()
      // TODO: Dynamically set the emoji based on guild's support tier
      .setTitle(`${context.emojiList.discordicon} ${context.guild!.name}`)
      .setColor('#733ebd')
      .setThumbnail(context.guild!.iconURL({ forceStatic: false, size: 512 }))
      .addField(':computer: Guild ID', context.guild!.id, true)
      .addField(':crown: Owner', (await context.guild!.fetchOwner()).toString(), true)
      .addField(':date: Created At', context.guild!.createdAt.toUTCString(), true)
      .addField(':desktop: Shard ID', context.guild!.shardId.toString(), true)
      .addField(':dizzy: I Joined At', context.guild!.members.cache.get(context.client.user!.id)!.joinedAt!.toUTCString(), true)
      .addField(`:speech_balloon: Channels (${context.guild!.channels.cache
        .filter((c) => c.type !== ChannelType.GuildCategory).size}) / Categories (${context.guild!.channels.cache
          .filter((c) => c.type === ChannelType.GuildCategory).size})`,
      `:loudspeaker: Announcements: ${context.guild!.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size}\n` +
      `:pencil: Texts: ${context.guild!.channels.cache.filter((c) => c.type === ChannelType.GuildText).size}\n` +
      `${context.emojiList.stage} Stages: ${context.guild!.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size}\n` +
      `:loud_sound: Voices: ${context.guild!.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size}\n` +
      `:file_folder: Forums: ${context.guild!.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size}\n`,
      false);

    await context.editReply(embed);
  }
}
