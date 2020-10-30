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

const { emojis } = require('../Utils');
const Discord = require('discord.js');
const pak = require('../../package.json');
const { links } = require('../../Configs');

exports.run = async (aruna, message) => {

  async function getUptime() {
    const req = await aruna.shard.broadcastEval('this.uptime');
    return req[0];
  }

  let totalSeconds = (await getUptime() / 1000);
  const days = Math.floor(totalSeconds / 86400);
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
    const req = await aruna.shard.fetchClientValues('users.size');

    return req.reduce((p, n) => p + n, 0);
  }

  const user = message.guild.member(aruna.user);

  const name = user.displayName;

  const embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .addField(`(${emojis.robot}) Nome na Guild`, name, true)
    .addField('(📡) Versão', pak.version, true)
    .addField('(🕰️) Uptime', uptime, true)
    .addField('(📃) Canais', await getChannelCount(), true)
    .addField('(🖥️) Servidores', await getServerCount(), true)
    .addField('(🕹️) Usuários', await getUserCount(), true)
    .addField('(💻) Seu Shard', aruna.shard.id, true)
    .addField('(💠) Total de Shards', aruna.shard.count, true)
    .addField('(🏓) Ping do Shard', `${aruna.ping}ms`, true)
    .addField(
      'Convite',
      `${links.invites[0] ? `[Link](${links.invites[0]})` : 'INDISPONÍVEL'}`,
      true
    )
    .addField('Meu Site', `${links.website ? `[Link](${links.website})` : 'Em Breve™️'}`, true)
    .addField(
      'Servidor de Suporte',
      `${links.supportServers[0] ? `[Link](${links.supportServers[0]})` : 'INDISPONÍVEL'}`,
      true
    )
    .setThumbnail(`${aruna.user.displayAvatarURL}`)
    .setFooter(`Informações Solicitadas por ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();
  message.channel.send(embed);
};

exports.config = {
  name: 'botinfo',
  aliases: ['bot', 'uptime'],
  description: 'Lista as Principais informações do bot',
  category: `${emojis.robot} Utilidades`,
  public: true
};
