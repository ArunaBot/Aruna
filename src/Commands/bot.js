/* eslint-disable no-unused-vars */
/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { emojis, sysdata } = require('../Utils');
const Discord = require('discord.js');
const { config, links } = require('../../Configs');
const pkg = require('../../package.json');

exports.run = async (aruna, message) => {

  async function getUptime() {
    const req = await aruna.shard.broadcastEval('this.uptime');
    return req.reduce((p, n) => p + n, 0);
  }

  let totalSeconds = ((await getUptime() / aruna.shard.count) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  var uptime;

  if (days >= 1) {
    uptime = `${days}d, ${hours}h, ${minutes}m`;
  } else if (hours >= 1) {
    uptime = `${hours}h, ${minutes}m, ${seconds}s`;
  } else if (minutes >= 1) {
    uptime = `${minutes}m, ${seconds}s`;
  } else {
    uptime = `${seconds}s`;
  }

  async function getServerCount() {
    const req = await aruna.shard.fetchClientValues('guilds.size');

    return req.reduce((p, n) => p + n, 0);
  }

  async function getChannelCount() {
    const req = await aruna.shard.fetchClientValues('channels.size');

    return req.reduce((p, n) => p + n, 0);
  }

  async function getUserCount() {
    const req = await aruna.shard.broadcastEval('this.guilds.reduce((p, n) => p + n.memberCount, 0)');

    return req.reduce((p, n) => p + n, 0);
  }

  const user = message.guild.member(aruna.user);

  const name = user.displayName;

  const version = pkg.version;

  const embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .setDescription('`Informações Básicas`')
    .addField(`(${emojis.robot}) Nome na Guild`, name, true)
    .addField('(📡) Versão', version, true)
    .addField('(🕰️) Uptime', uptime, true)
    .addField('(📃) Canais', await getChannelCount(), true)
    .addField('(🖥️) Servidores', await getServerCount(), true)
    .addField('(🕹️) Usuários', await getUserCount(), true)
    .addField('(💻) Seu Shard', aruna.shard.id, true)
    .addField('(💠) Total de Shards', aruna.shard.count, true)
    .addField('(🏓) Ping do Shard', `${Math.round(aruna.ping)}ms`, true)
    .setThumbnail(`${aruna.user.displayAvatarURL}`)
    .setFooter(`Informações Solicitadas por ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();

  if (links.invites[0]) {
    embed.addField('Convite', `${`[Link](${links.invites[0]})`}`, true);
  }
    
  if (links.website) {
    embed.addField('Meu Site', `[Link](${links.website})}`, true);
  }
    
  if (links.supportServers[0]) {
    embed.addField('Servidor de Suporte', `[Link](${links.supportServers[0]})}`, true);
  }

  var os = await sysdata.GetOSData();

  var rambo = await sysdata.GetMemoryAmount();

  const ram = Math.round(rambo.used / 1024 / 1024 * 10) / 10;

  const ramT = Math.round(rambo.total / 1024 / 1024 * 10) / 10;

  var cpu = await sysdata.GetCPUModel();

  const time = 60000;

  const embed2 = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .setDescription('`Informações Avançadas`')
    .addField('Versão do Node', process.version)
    .addField('Versão do discord.js', pkg.dependencies['discord.js'].replace('^', ''))
    .addField('Informações da Host', `Sistema Operacional: ${os.distro}\n
    Processador: ${cpu.manufacturer} ${cpu.brand}\n
    Núcleos do Processador: ${cpu.cores}\n
    Uso de Ram: ${ram}mb / ${ramT}mb`)
    .addField('Criada e Desenvolvida Por', 'Lobo Metalurgico (<@281515925960654848>)\n\nContato: https://youtube.com/LoboMetalurgico | contato@lobometalurgico.tk')
    .addField('Idealizada Por', 'Carson (<@773670346921476166>)')
    .addField('Avatar Por', 'Kira\'s Art (<@207023257512181760>)\n\nContato: https://twitter.com/kiratokioArt')
    .setFooter(`Informações Solicitadas por ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();

  message.channel.send(embed).then(async msg => {
    await collector1(msg, false);
  });

  async function collector1 (msg, needRemoveEmote) {
    if (needRemoveEmote) {
      await removeEmote(msg);
      await msg.edit(embed);
    }
    await msg.react('🔴');
    await msg.react('▶️');

    const filter1 = (reaction, user) => {
      return ['🔴', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = msg.createReactionCollector(filter1, { max: 1, time: time, errors: ['time'] });

    collector.on('collect', async (reaction, reactionCollector) => {
      const reactionName = reaction.emoji.name;

      switch (reactionName) {
        case '▶️':
          collector2(msg, true);
          break;
        case '🔴':
        default: 
          removeEmote(msg);
          break;
      }
    });

    collector.on('end', async () => {
      await removeEmote(msg);
    });
  }

  async function collector2 (msg, needRemoveEmote) {
    if (needRemoveEmote) {
      await removeEmote(msg);
      await msg.edit(embed2);
    }

    await msg.react('◀️');
    await msg.react('🔴');

    const filter1 = (reaction, user) => {
      return ['🔴', '◀️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = msg.createReactionCollector(filter1, { max: 1, time: time, errors: ['time'] });

    collector.on('collect', async (reaction, reactionCollector) => {
      const reactionName = reaction.emoji.name;

      switch (reactionName) {
        case '◀️':
          collector1(msg, true);
          break;
        case '🔴':
        default: 
          removeEmote(msg);
          break;
      }

    });

    collector.on('end', async () => {
      await removeEmote(msg);
    });
  }

  async function removeEmote(msg) {
    await msg.clearReactions();
  }
};

exports.config = {
  name: 'botinfo',
  aliases: ['bot', 'uptime'],
  description: 'Lista as Principais informações do bot',
  category: `${emojis.robot} Utilidades`,
  public: true
};
