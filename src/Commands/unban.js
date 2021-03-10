/* eslint-disable max-len */
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

const Discord = require('discord.js');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);
// eslint-disable-next-line no-unused-vars
const { date } = require('../Utils');
const dateFormat = require('dateformat');
const now = new Date();

exports.run = async (aruna, message, args, langc, prefix, command) => {
  if (langc) {
    language = langc;
  }
  
  const error1 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.unban.embed.error.description1.replace('[banMembers]', language.generic.permissions.banMembers))
    .setTimestamp();
  
  const error2 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.unban.embed.error.description2.replace('[banMembers]', language.generic.permissions.banMembers))
    .setTimestamp();
  
  const error3 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.unban.embed.error.description3)
    .setTimestamp();

  const error6 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(`${language.unban.embed.error.userNotFound.line1}\n
    ${language.unban.embed.error.userNotFound.line2}`)
    .setTimestamp();

  if (!args[0] || isNaN(args[0]) && (!args[0].includes('<@') || !args[0].includes('>'))) return message.channel.send(error3);

  const unbUser = await aruna.fetchUser(message.mentions.users.first() || args[0]).catch(e => {
    console.warn(e);
    if (args[0].length !== 18) return null;
    message.channel.send(error6);
    return 'STOP';
  }); /** @todo: Fix #30 */

  if (!unbUser) return message.channel.send(error3);
  if (unbUser == 'STOP') return;

  const error4 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.unban.embed.error.description4.replace('[ownerName]', unbUser.username))
    .setTimestamp();
    
  const error5 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.generic.embed.error.description)
    .setTimestamp();
  
  if (!message.member.hasPermission('BAN_MEMBERS'))
    return message.channel.send(error1);
  if (!message.guild.members.cache.get(aruna.user.id).hasPermission('BAN_MEMBERS'))
    return message.channel.send(error2);
  
  const guildBuser = message.guild.member(
    message.mentions.users.first() || message.guild.members.cache.get(args[0])
  );

  if (guildBuser) {
    if (message.guild.owner.id == unbUser.id)
      return message.channel.send(error4);
  }
  
  var reason = message.content.slice(command.length + prefix.length).trim();

  if (args[0].includes('<@!') && args[0].includes('>')) {
    reason = reason.slice(5 + unbUser.id.length).trim();
  } else if (args[0].includes('<@') && args[0].includes('>')) {
    reason = reason.slice(4 + unbUser.id.length).trim();
  } else {
    reason = reason.slice(unbUser.id.length).trim();
  }
  
  if (!reason) {
    reason = language.unban.reason['1'].replace('[username]', message.author.username);
  } else {
    reason = language.unban.reason['2'].replace('[username]', message.author.username).replace('[reason]', reason);
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor(language.unban.embed.sucess.title)
    .setDescription(language.unban.embed.sucess.description.replace('[username]', unbUser.username))
    .addField(language.unban.embed.sucess.field1.title, language.unban.embed.sucess.field1.content.replace('[username]', unbUser.username).replace('[userId]', unbUser.id), false)
    .addField(language.unban.embed.sucess.field2, message.author, false)
    .addField(language.unban.embed.sucess.field3, dateFormat(now, language.generic.strings.date), false)
    .addField(language.unban.embed.sucess.field4, reason, false)
    .setTimestamp();

  message.guild.unban(unbUser, reason).catch(err => {
    console.log(err);
    return message.channel.send(error5);
  }).then(() => {
    message.channel.send(embed);
  });
};

exports.config = {
  name: 'desbanir',
  aliases: ['unban'],
  description: language.unban.config.description,
  category: '👮‍♂️ Moderação',
  public: true
};