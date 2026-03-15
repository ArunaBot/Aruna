import { ButtonStructure, ButtonStyle, MessageFlags, MessageStructure } from 'arunabase/build/discord';
import { IDiscordFullCommandContext } from '../interfaces';
import { execSync } from 'node:child_process';
import { ArunaAsyncCommand } from '../structure';
import { version } from 'arunabase/package.json';
import { getFormattedTime } from '../../utils';
import { DefaultEmbed } from '../utils';
import si from 'systeminformation';

export default class BotInfoCommand extends ArunaAsyncCommand {
  constructor() {
    super('botinfo', {
      name_localizations: {
        'pt-BR': 'botinfo',
      },
      description: 'Return some information about the bot',
      description_localizations: {
        'pt-BR': 'Retorna algumas informações sobre o bot',
      },
      aliases: ['bi', 'bot', 'info'],
      category: 'Information',
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    await context.deferReply();

    let botVersion = '';
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') botVersion = 'DEVELOPMENT';
    else if (process.env.NODE_ENV === 'stage') {
      if (process.env.npm_package_version) botVersion = `${process.env.npm_package_version}-`;
      const gitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 6);
      if (context.urls.github) {
        botVersion += `[GIT#${gitHash}](${context.urls.github}/commit/${gitHash})`;
      } else botVersion += `GIT#${gitHash}`;
    } else botVersion = process.env.npm_package_version ?? 'unk';
  
    const page1 = new DefaultEmbed()
      .setAuthor({
        name: context.guild?.members.cache.get(context.client.user!.id)?.displayName ??
          context.client.user!.displayName,
        iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setTitle('**Bot Information**')
      .setThumbnail(context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }))
      .addField('Bot Name', context.client.user!.displayName, true)
      .addField('Bot Version', botVersion, true)
      .addField('Commands', `${context.client.getCommandManager().getCommands().length}`, true)
      .addField('ArunaBase Version', 'v' + version, true)
      .addField('Node.js Version', process.version, true)
      .addField('Guilds', `${context.client.guilds.cache.size}`, true)
      .addField('Latency', `${Math.round(context.client.ws.ping)}ms`, true)
      .addField('Uptime', getFormattedTime(context.client.uptime!), true);

    if (context.urls.tos && context.urls.privacy && context.urls.website) {
      if (context.urls.github) {
        page1.addField('GitHub Repository', `[Click here](${context.urls.github})`, true);
      }
      page1.addFields(
        { name: 'Terms of Service', value: `[Click here](${context.urls.tos})`, inline: true },
        { name: 'Privacy Policy', value: `[Click here](${context.urls.privacy})`, inline: true },
        { name: 'Website', value: `[Click here](${context.urls.website})`, inline: true },
      );
    } else if (context.urls.website) {
      page1.addField('Website', `[Click here](${context.urls.website})`, true);
    } else if (context.urls.github) {
      page1.addField('GitHub Repository', `[Click here](${context.urls.github})`, true);
    } else page1.addBlakField(true);
    
    if (context.client.shard) {
      page1.addField('Current Shard ID', `${context.client.shard.ids.join(', ') ?? '0'}`, true)
        .addField('Total Shard Count', `${context.client.shard.count ?? 1}`, true);
    }

    const embed2 = new DefaultEmbed()
      .setAuthor({
        name: context.guild?.members.cache.get(context.client.user!.id)?.displayName ??
          context.client.user!.displayName,
        iconURL: context.client.user!.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setTitle('**More Information**')
      .addField('**Host Information**', 
        `
        **OS:** ${await si.osInfo().then((os) => os.distro)}
        **CPU:** ${await si.cpu().then((cpu) => cpu.manufacturer + ' ' + cpu.brand + ' ')}
        **CPU Cores:** ${await si.cpu().then((cpu) => `${cpu.physicalCores} cores / ${cpu.cores} threads ${isNaN(cpu.speedMax) ? '' : `@ ${cpu.speedMax}GHz`}`)}
        **RAM:** ${await si.mem().then((mem) => (mem.active / 1024 / 1024 / 1024).toFixed(2) + 'GB')} / ${await si.mem().then((mem) => (mem.total / 1024 / 1024 / 1024).toFixed(2) + 'GB')}
        `,
        false,
      );

    if (context.urls.website && context.urls.github) {
      embed2.addField('Usefull Links',
        `
        Website: [Click here](${context.urls.website})
        GitHub Repository: [Click here](${context.urls.github})
        ${context.urls.discord ? `Support Server: [Click here](${context.urls.discord})` : ''}
        `,
        false,
      );
    }

    embed2.addField('Created and Developed By', `
        LoboMetalurgico (<@281515925960654848>)

        Email: lobometalurgico@allonsve.com
        Github: https://github.com/LoboMetalurgico
        Youtube: https://youtube.com/LoboMetalurgico
        Twitch: https://twitch.tv/LoboMetalurgico
        Kick: https://kick.com/LoboMetalurgico
        `, false)
      .addField('With the help of', `
        SpaceFox (<@430169509165268992>)

        Github: https://github.com/SpaceFox1
        `, false)
      .addField('Art By', 'Kira\'s Art (<@207023257512181760>)', false);


    async function setPage1(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await context.editReply(new MessageStructure(page1).addButtons(page1Buttons));
    }

    async function setPage2(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await context.editReply(new MessageStructure(embed2).addButtons(page2Buttons));
    }

    const page1Buttons = [
      new ButtonStructure({
        label: 'Back',
        emoji: '◀️',
        disabled: true,
        style: ButtonStyle.Secondary,
      }),
      new ButtonStructure({
        label: 'Next',
        emoji: '▶️',
        style: ButtonStyle.Primary,
      }, async (ctx) => {
        if (ctx.user.id !== context.author.id) {
          await ctx.reply({ content: 'Only the command executor can use these buttons!', flags: MessageFlags.Ephemeral }).catch(() => {});
          return;
        }
        await setPage2().catch(() => {});
        ctx.deferUpdate().catch(() => {});
      }),
    ];

    const page2Buttons = [
      new ButtonStructure({
        label: 'Back',
        emoji: '◀️',
        style: ButtonStyle.Primary,
      }, async (ctx) => {
        if (ctx.user.id !== context.author.id) {
          await ctx.reply({ content: 'Only the command executor can use these buttons!', flags: MessageFlags.Ephemeral }).catch(() => {});
          return;
        }
        await setPage1().catch(() => {});
        ctx.deferUpdate().catch(() => {});
      }),
      new ButtonStructure({
        label: 'Next',
        emoji: '▶️',
        disabled: true,
        style: ButtonStyle.Secondary,
      }),
    ];

    
    await context.editReply(new MessageStructure(page1).addButtons(page1Buttons));
  }
}
