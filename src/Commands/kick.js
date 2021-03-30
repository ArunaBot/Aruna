/* eslint-disable max-len */
/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2021

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

  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description1.replace('[kickMembers]', language.generic.permissions.kickMembers))
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description2.replace('[kickMembers]', language.generic.permissions.kickMembers))
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description3)
    .setTimestamp();

  if (!args[0] || isNaN(args[0]) && (!args[0].includes('<@') || !args[0].includes('>'))) return message.channel.send(error3);

  const kuser = await aruna.fetchUser(message.mentions.users.first() || args[0]);

  if (!kuser) return message.channel.send(error3);

  const error4 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description4.replace('[ownerName]', kuser.username))
    .setTimestamp();

  const error5 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description5.replace('[username]', kuser.username))
    .setTimestamp();

  const error6 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.kick.embed.error.description6.replace('[username]', kuser.username))
    .setTimestamp();
    
  const error7 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.generic.embed.error.description)
    .setTimestamp();
  
  if (!message.member.hasPermission('KICK_MEMBERS'))
    return message.channel.send(error1);
  if (!message.guild.members.get(aruna.user.id).hasPermission('KICK_MEMBERS'))
    return message.channel.send(error2);
  
  const guildBuser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );

  if (guildBuser) {
    if (message.guild.owner.id == kuser.id)
      return message.channel.send(error4);
    if (guildBuser.highestRole.position >= message.guild.members.get(message.author.id).highestRole.position && message.guild.owner.id !== message.author.id)
      return message.channel.send(error5);
    if (guildBuser.highestRole.position >= message.guild.members.get(aruna.user.id).highestRole.position)
      return message.channel.send(error6);
  }
  
  var reason = message.content.slice(command.length + prefix.length).trim();

  if (args[0].includes('<@!') && args[0].includes('>')) {
    reason = reason.slice(5 + kuser.id.length).trim();
  } else if (args[0].includes('<@') && args[0].includes('>')) {
    reason = reason.slice(4 + kuser.id.length).trim();
  } else {
    reason = reason.slice(kuser.id.length).trim();
  }
  
  if (!reason) {
    reason = language.kick.reason['1'].replace('[username]', message.author.username);
  } else {
    reason = language.kick.reason['2'].replace('[username]', message.author.username).replace('[reason]', reason);
  }

  const embed = new Discord.RichEmbed()
    .setAuthor(language.kick.embed.sucess.title)
    .setDescription(language.kick.embed.sucess.description.replace('[username]', kuser.username))
    .addField(language.kick.embed.sucess.field1.title, language.kick.embed.sucess.field1.content.replace('[username]', kuser.username).replace('[userId]', kuser.id), false)
    .addField(language.kick.embed.sucess.field2, message.author, false)
    .addField(language.kick.embed.sucess.field3, dateFormat(now, language.generic.strings.date), false)
    .addField(language.kick.embed.sucess.field4, reason, false)
    .setTimestamp();

  
  message.guild.member(kuser).kick(reason).catch(err => {
    console.log(err);
    return message.channel.send(error7);
  }).then(() => {
    message.channel.send(embed);
  });
};

exports.config = {
  name: 'kickar',
  aliases: ['kick', 'expulsar'],
  description: language.kick.config.description,
  category: '👮‍♂️ Moderação',
  public: true
};