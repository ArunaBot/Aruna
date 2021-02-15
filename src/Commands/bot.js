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

const { emoji, sysdata } = require('../Utils');
const Discord = require('discord.js');
const { config, links } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);
const pkg = require('../../package.json');

exports.run = async (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const preEmbed = new Discord.RichEmbed()
    .setTitle(language.bot.embed.pre.title.replace('%s', emoji.loading).replace('%s', message.member.displayName))
    .setColor('#00000')
    .setDescription(language.bot.embed.pre.description)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setTimestamp();

  const preMessage = await message.channel.send(preEmbed);

  const time = 60000;

  let totalSeconds = (aruna.uptime / 1000);
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

  /* async function getServerCount() {
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
  } */

  const user = message.guild.member(aruna.user);

  const name = user.displayName;

  const version = pkg.version;

  const embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .setDescription(language.bot.embed.basic.description)
    .addField(language.bot.embed.basic.field[0].replace('%s', emoji.robot), name, true)
    .addField(language.bot.embed.basic.field[1].replace('%s', '📡'), version, true)
    .addField(language.bot.embed.basic.field[2].replace('%s', '🕰️'), uptime, true)
    // .addField(language.bot.embed.basic.field[3].replace('%s', '📃'), await getChannelCount(), true)
    // .addField(language.bot.embed.basic.field[4].replace('%s', '🖥️'), await getServerCount(), true)
    // .addField(language.bot.embed.basic.field[5].replace('%s', '🕹️'), await getUserCount(), true)
    .addField(language.bot.embed.basic.field[6].replace('%s', '💻'), aruna.shard.id, true)
    .addField(language.bot.embed.basic.field[7].replace('%s', '💠'), aruna.shard.count, true)
    .addField(language.bot.embed.basic.field[8].replace('%s', '🏓'), `${Math.round(aruna.ping)}ms`, true)
    .setThumbnail(aruna.user.displayAvatarURL)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag), message.author.avatarURL)
    .setTimestamp();

  if (links.invites[0]) {
    embed.addField(language.bot.embed.basic.field[9],
      language.bot.generic.linkr
        .replace('%s', language.generic.strings.link)
        .replace('%s', links.invites[0]), true);
  }
    
  if (links.website) {
    embed.addField(language.bot.embed.basic.field[10],
      language.bot.generic.linkr
        .replace('%s', language.generic.strings.link)
        .replace('%s', links.website), true);
  }
    
  if (links.supportServers[0]) {
    embed.addField(language.bot.embed.basic.field[11],
      language.bot.generic.linkr
        .replace('%s', language.generic.strings.link)
        .replace('%s', links.supportServers[0]), true);
  }

  var os = await sysdata.GetOSData();

  var rambo = await sysdata.GetMemoryAmount();

  const ram = Math.round(rambo.used / 1024 / 1024 * 10) / 10;

  const ramT = Math.round(rambo.total / 1024 / 1024 * 10) / 10;

  var cpu = await sysdata.GetCPUModel();

  const embed2 = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .setDescription(language.bot.embed.advanced.description)
    .addField(language.bot.embed.advanced.field[0], process.version)
    .addField(language.bot.embed.advanced.field[1], pkg.dependencies['discord.js'].replace('^', ''))
    .addField(language.bot.embed.advanced.field[2],
      `${language.bot.embed.advanced.content[2][0]} ${os.distro}\n
       ${language.bot.embed.advanced.content[2][1]} ${cpu.manufacturer} ${cpu.brand}\n
       ${language.bot.embed.advanced.content[2][2]} ${cpu.cores}\n
       ${language.bot.embed.advanced.content[2][3]} ${ram}mb / ${ramT}mb
      `)
    .addField(language.bot.embed.advanced.field[3], language.bot.embed.advanced.content[3])
    .addField(language.bot.embed.advanced.field[4], language.bot.embed.advanced.content[4])
    .addField(language.bot.embed.advanced.field[5], language.bot.embed.advanced.content[5])
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag), message.author.avatarURL)
    .setTimestamp();

  message.channel.send(embed).then(async msg => {
    await collector1(msg, false);
    preMessage.delete();
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
  aliases: ['bot', 'uptime', 'robotinfo', 'info'],
  category: `${emoji.robot} Utilidades`,
  description: language.bot.config.description,
  public: true
};
